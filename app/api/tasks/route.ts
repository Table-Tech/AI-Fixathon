import { NextResponse } from "next/server";
import { createServerClientWithAuth } from "@/lib/supabase/server";
import { logAudit, AuditActions } from "@/lib/audit";
import { headers } from "next/headers";

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

  return { user, supabase };
}

// GET /api/tasks - List user's tasks with subtasks
export async function GET(request: Request) {
  try {
    const auth = await getUser(request);

    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { user, supabase } = auth;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from("tasks")
      .select(`
        *,
        subtasks (*),
        regeling:regelingen (id, title, slug, details)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json(
        { error: "Failed to fetch tasks" },
        { status: 500 }
      );
    }

    // Sort subtasks by order
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tasksWithSortedSubtasks = data?.map((task: any) => ({
      ...task,
      subtasks: task.subtasks?.sort((a: { order: number }, b: { order: number }) => a.order - b.order) || [],
    }));

    return NextResponse.json({ data: tasksWithSortedSubtasks });
  } catch (err) {
    console.error("Tasks API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: Request) {
  try {
    const auth = await getUser(request);

    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { user, supabase } = auth;
    const body = await request.json();

    const { title, description, regeling_id, subtasks } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Create the task
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: task, error: taskError } = await (supabase as any)
      .from("tasks")
      .insert({
        user_id: user.id,
        title,
        description,
        regeling_id,
        status: "pending",
      })
      .select()
      .single();

    if (taskError) {
      console.error("Error creating task:", taskError);
      return NextResponse.json(
        { error: "Failed to create task" },
        { status: 500 }
      );
    }

    // Create subtasks if provided
    if (subtasks && Array.isArray(subtasks) && subtasks.length > 0) {
      const subtasksToInsert = subtasks.map((st: { title: string }, index: number) => ({
        task_id: task.id,
        title: st.title,
        order: index,
        is_done: false,
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: subtasksError } = await (supabase as any)
        .from("subtasks")
        .insert(subtasksToInsert);

      if (subtasksError) {
        console.error("Error creating subtasks:", subtasksError);
        // Don't fail the whole request, just log
      }
    }

    // Log audit
    await logAudit({
      userId: user.id,
      action: AuditActions.TASK_CREATED,
      resourceType: "task",
      resourceId: task.id,
      details: { title, regeling_id },
      riskLevel: "medium",
    });

    // Fetch the complete task with subtasks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: completeTask } = await (supabase as any)
      .from("tasks")
      .select(`
        *,
        subtasks (*),
        regeling:regelingen (id, title, slug)
      `)
      .eq("id", task.id)
      .single();

    return NextResponse.json({ data: completeTask }, { status: 201 });
  } catch (err) {
    console.error("Tasks API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
