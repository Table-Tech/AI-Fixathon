import { NextResponse } from "next/server";
import { createServerClient, createServerClientWithAuth } from "@/lib/supabase/server";
import { logAudit, AuditActions } from "@/lib/audit";
import { headers } from "next/headers";

const ACTIVEPIECES_WEBHOOK_URL = process.env.ACTIVEPIECES_WEBHOOK_URL || "https://cloud.activepieces.com/api/v1/webhooks/xyVdZt7SMCPBg0QwcvC8h/sync";

// Validate AI response structure
interface AITaskResponse {
  title: string;
  description?: string;
  regeling_id?: string | null;
  status?: string;
  subtasks?: Array<{ title: string; order: number }>;
}

function validateAIResponse(data: unknown): AITaskResponse | null {
  if (!data || typeof data !== "object") return null;

  const obj = data as Record<string, unknown>;

  if (typeof obj.title !== "string" || obj.title.trim() === "") {
    return null;
  }

  const validated: AITaskResponse = {
    title: obj.title.trim(),
    description: typeof obj.description === "string" ? obj.description : undefined,
    regeling_id: typeof obj.regeling_id === "string" ? obj.regeling_id : null,
    status: "pending",
    subtasks: [],
  };

  // Validate subtasks
  if (Array.isArray(obj.subtasks)) {
    validated.subtasks = obj.subtasks
      .filter((st): st is { title: string; order: number } =>
        typeof st === "object" &&
        st !== null &&
        typeof (st as Record<string, unknown>).title === "string"
      )
      .slice(0, 8) // Max 8 subtasks
      .map((st, index) => ({
        title: st.title.trim(),
        order: index + 1,
      }));
  }

  return validated;
}

// Helper to get user from auth header
async function getUser(request: Request) {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "");
  const supabase = createServerClientWithAuth(token);

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return { user, token };
}

// POST /api/tasks/from-ai - Create task from AI
export async function POST(request: Request) {
  try {
    // Get authenticated user
    const auth = await getUser(request);

    if (!auth) {
      return NextResponse.json(
        { error: "Je moet ingelogd zijn om taken aan te maken" },
        { status: 401 }
      );
    }

    const { user } = auth;
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "Bericht is verplicht" },
        { status: 400 }
      );
    }

    // Call Activepieces webhook
    let aiResponse: AITaskResponse | null = null;

    try {
      console.log("📤 Calling Activepieces webhook:", ACTIVEPIECES_WEBHOOK_URL);
      console.log("📤 Request body:", { user_id: user.id, message: message.trim() });

      const webhookResponse = await fetch(ACTIVEPIECES_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          message: message.trim(),
        }),
      });

      console.log("📥 Webhook response status:", webhookResponse.status);

      if (!webhookResponse.ok) {
        throw new Error(`Webhook responded with status ${webhookResponse.status}`);
      }

      const responseText = await webhookResponse.text();
      console.log("📥 Webhook raw response:", responseText);

      // Try to parse the response
      if (responseText && responseText.trim() !== "" && responseText !== "{}") {
        try {
          // First try direct JSON parse
          let parsed = JSON.parse(responseText);
          console.log("📥 Parsed JSON:", parsed);

          // If the response is a string containing JSON, parse again
          if (typeof parsed === "string") {
            parsed = JSON.parse(parsed);
            console.log("📥 Double-parsed JSON:", parsed);
          }

          aiResponse = validateAIResponse(parsed);
          console.log("✅ Validated AI response:", aiResponse);
        } catch (parseError) {
          console.error("❌ Failed to parse AI response:", parseError);
        }
      } else {
        console.log("⚠️ Webhook returned empty or {} response");
      }
    } catch (webhookError) {
      console.error("❌ Activepieces webhook error:", webhookError);
      // Continue with fallback
    }

    // Fallback: if Activepieces returns empty/invalid, create a basic task
    if (!aiResponse) {
      aiResponse = {
        title: message.trim().slice(0, 100),
        description: "Taak aangemaakt vanuit je bericht",
        status: "pending",
        subtasks: [],
      };
    }

    // Use service role client for database operations
    const supabase = createServerClient();

    // Create the task
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: task, error: taskError } = await (supabase as any)
      .from("tasks")
      .insert({
        user_id: user.id,
        title: aiResponse.title,
        description: aiResponse.description || null,
        regeling_id: aiResponse.regeling_id || null,
        status: "pending",
      })
      .select()
      .single();

    if (taskError) {
      console.error("Error creating task:", taskError);
      return NextResponse.json(
        { error: "Kon taak niet aanmaken" },
        { status: 500 }
      );
    }

    // Create subtasks if provided
    if (aiResponse.subtasks && aiResponse.subtasks.length > 0) {
      const subtasksToInsert = aiResponse.subtasks.map((st, index) => ({
        task_id: task.id,
        title: st.title,
        order: index + 1,
        is_done: false,
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: subtasksError } = await (supabase as any)
        .from("subtasks")
        .insert(subtasksToInsert);

      if (subtasksError) {
        console.error("Error creating subtasks:", subtasksError);
        // If subtasks fail, delete the task (rollback)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from("tasks").delete().eq("id", task.id);
        return NextResponse.json(
          { error: "Kon subtaken niet aanmaken" },
          { status: 500 }
        );
      }
    }

    // Log audit
    await logAudit({
      userId: user.id,
      action: AuditActions.TASK_CREATED,
      resourceType: "task",
      resourceId: task.id,
      details: {
        title: aiResponse.title,
        source: "ai",
        original_message: message.trim().slice(0, 200),
      },
      riskLevel: "low",
    });

    // Fetch the complete task with subtasks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: completeTask, error: fetchError } = await (supabase as any)
      .from("tasks")
      .select(`
        *,
        subtasks (*)
      `)
      .eq("id", task.id)
      .single();

    if (fetchError) {
      console.error("Error fetching complete task:", fetchError);
    }

    // Sort subtasks by order
    if (completeTask?.subtasks) {
      completeTask.subtasks.sort((a: { order: number }, b: { order: number }) => a.order - b.order);
    }

    return NextResponse.json({
      data: completeTask || task,
      message: "Taak succesvol aangemaakt"
    }, { status: 201 });

  } catch (err) {
    console.error("Tasks from-ai API error:", err);
    return NextResponse.json(
      { error: "Er ging iets mis. Probeer het opnieuw." },
      { status: 500 }
    );
  }
}
