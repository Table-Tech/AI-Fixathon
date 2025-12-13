import { NextResponse } from "next/server";
import { createServerClientWithAuth } from "@/lib/supabase/server";
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

  return { user, supabase };
}

// POST /api/tasks/[id]/subtasks - Create subtask for a task
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const auth = await getUser();

    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { user, supabase } = auth;
    const body = await request.json();

    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Verify the task belongs to the user
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("id")
      .eq("id", taskId)
      .eq("user_id", user.id)
      .single();

    if (taskError || !task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Get the current max order for this task's subtasks
    const { data: existingSubtasks } = await supabase
      .from("subtasks")
      .select("order")
      .eq("task_id", taskId)
      .order("order", { ascending: false })
      .limit(1);

    const nextOrder = (existingSubtasks?.[0]?.order ?? -1) + 1;

    // Create the subtask
    const { data: subtask, error: subtaskError } = await supabase
      .from("subtasks")
      .insert({
        task_id: taskId,
        title,
        order: nextOrder,
        is_done: false,
      })
      .select()
      .single();

    if (subtaskError) {
      console.error("Error creating subtask:", subtaskError);
      return NextResponse.json(
        { error: "Failed to create subtask" },
        { status: 500 }
      );
    }

    // Log audit
    await logAudit({
      userId: user.id,
      action: AuditActions.SUBTASK_CREATED,
      resourceType: "subtask",
      resourceId: subtask.id,
      details: { task_id: taskId, title },
      riskLevel: "low",
    });

    return NextResponse.json({ data: subtask }, { status: 201 });
  } catch (err) {
    console.error("Subtasks API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
