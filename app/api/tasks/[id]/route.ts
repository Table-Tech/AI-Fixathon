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

// GET /api/tasks/[id] - Get single task with subtasks
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getUser();

    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { user, supabase } = auth;

    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        subtasks (*),
        regeling:regelingen (id, title, slug, details)
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Task not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching task:", error);
      return NextResponse.json(
        { error: "Failed to fetch task" },
        { status: 500 }
      );
    }

    // Sort subtasks by order
    const taskWithSortedSubtasks = {
      ...data,
      subtasks: data.subtasks?.sort((a: { order: number }, b: { order: number }) => a.order - b.order) || [],
    };

    return NextResponse.json({ data: taskWithSortedSubtasks });
  } catch (err) {
    console.error("Task API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks/[id] - Update task
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getUser();

    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { user, supabase } = auth;
    const body = await request.json();

    const { title, description, status } = body;

    // Build update object
    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select(`
        *,
        subtasks (*),
        regeling:regelingen (id, title, slug)
      `)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Task not found" },
          { status: 404 }
        );
      }
      console.error("Error updating task:", error);
      return NextResponse.json(
        { error: "Failed to update task" },
        { status: 500 }
      );
    }

    // Log audit
    const action = status === "completed" ? AuditActions.TASK_COMPLETED : AuditActions.TASK_UPDATED;
    await logAudit({
      userId: user.id,
      action,
      resourceType: "task",
      resourceId: id,
      details: updates,
      riskLevel: "medium",
    });

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Task API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getUser();

    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { user, supabase } = auth;

    // First check if task exists and belongs to user
    const { data: existingTask, error: checkError } = await supabase
      .from("tasks")
      .select("id, title")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (checkError || !existingTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Delete (subtasks will cascade)
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting task:", error);
      return NextResponse.json(
        { error: "Failed to delete task" },
        { status: 500 }
      );
    }

    // Log audit
    await logAudit({
      userId: user.id,
      action: AuditActions.TASK_DELETED,
      resourceType: "task",
      resourceId: id,
      details: { title: existingTask.title },
      riskLevel: "medium",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Task API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
