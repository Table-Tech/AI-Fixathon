import { NextResponse } from "next/server";
import { createServerClient, createServerClientWithAuth } from "@/lib/supabase/server";
import { logAudit, AuditActions } from "@/lib/audit";
import { headers } from "next/headers";

// Helper to get user from auth header
async function getUser() {
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

// POST /api/tasks/from-regeling - Create task from regeling
export async function POST(request: Request) {
  try {
    // Get authenticated user
    const auth = await getUser();

    if (!auth) {
      return NextResponse.json(
        { error: "Je moet ingelogd zijn om taken aan te maken" },
        { status: 401 }
      );
    }

    const { user } = auth;
    const body = await request.json();
    const { regeling_id, regeling_title, documents_needed, provider } = body;

    if (!regeling_id || !regeling_title) {
      return NextResponse.json(
        { error: "Regeling informatie is verplicht" },
        { status: 400 }
      );
    }

    // Generate subtasks from documents_needed
    const subtasks: { title: string; order: number }[] = [];
    let order = 1;

    // First subtask: check requirements
    subtasks.push({
      title: "Check of je aan de voorwaarden voldoet",
      order: order++,
    });

    // Add document subtasks
    if (documents_needed && Array.isArray(documents_needed)) {
      for (const doc of documents_needed) {
        subtasks.push({
          title: `Verzamel: ${doc}`,
          order: order++,
        });
      }
    }

    // Final subtask: submit application
    subtasks.push({
      title: provider ? `Dien aanvraag in bij ${provider}` : "Dien aanvraag in",
      order: order++,
    });

    // Use service role client for database operations
    const supabase = createServerClient();

    // Create the task
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: task, error: taskError } = await (supabase as any)
      .from("tasks")
      .insert({
        user_id: user.id,
        title: `${regeling_title} aanvragen`,
        description: `Alle stappen om ${regeling_title} aan te vragen`,
        regeling_id: regeling_id,
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

    // Create subtasks
    if (subtasks.length > 0) {
      const subtasksToInsert = subtasks.map((st) => ({
        task_id: task.id,
        title: st.title,
        order: st.order,
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
        title: `${regeling_title} aanvragen`,
        source: "regeling",
        regeling_id,
      },
      riskLevel: "low",
    });

    // Fetch the complete task with subtasks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: completeTask } = await (supabase as any)
      .from("tasks")
      .select(`
        *,
        subtasks (*)
      `)
      .eq("id", task.id)
      .single();

    // Sort subtasks by order
    if (completeTask?.subtasks) {
      completeTask.subtasks.sort((a: { order: number }, b: { order: number }) => a.order - b.order);
    }

    return NextResponse.json({
      data: completeTask || task,
      message: "Taak succesvol aangemaakt"
    }, { status: 201 });

  } catch (err) {
    console.error("Tasks from-regeling API error:", err);
    return NextResponse.json(
      { error: "Er ging iets mis. Probeer het opnieuw." },
      { status: 500 }
    );
  }
}
