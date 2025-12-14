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

// PATCH /api/subtasks/[id] - Update subtask (toggle done, update title)
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

    const { title, is_done, order } = body;

    // First verify the subtask belongs to a task owned by this user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: subtaskData, error: checkError } = await (supabase as any)
      .from("subtasks")
      .select(`
        id,
        task_id,
        task:tasks!inner (user_id)
      `)
      .eq("id", id)
      .single();

    const subtask = subtaskData as { id: string; task_id: string; task: { user_id: string } } | null;

    if (checkError || !subtask) {
      return NextResponse.json(
        { error: "Subtask not found" },
        { status: 404 }
      );
    }

    // Check ownership
    const taskData = subtask.task;
    if (taskData.user_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Build update object
    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (is_done !== undefined) updates.is_done = is_done;
    if (order !== undefined) updates.order = order;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updatedSubtask, error } = await (supabase as any)
      .from("subtasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating subtask:", error);
      return NextResponse.json(
        { error: "Failed to update subtask" },
        { status: 500 }
      );
    }

    // Log audit if completed
    if (is_done === true) {
      await logAudit({
        userId: user.id,
        action: AuditActions.SUBTASK_COMPLETED,
        resourceType: "subtask",
        resourceId: id,
        details: { task_id: subtask.task_id },
        riskLevel: "low",
      });
    }

    return NextResponse.json({ data: updatedSubtask });
  } catch (err) {
    console.error("Subtask API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/subtasks/[id] - Delete subtask
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

    // First verify the subtask belongs to a task owned by this user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: subtaskData2, error: checkError } = await (supabase as any)
      .from("subtasks")
      .select(`
        id,
        task:tasks!inner (user_id)
      `)
      .eq("id", id)
      .single();

    const subtask = subtaskData2 as { id: string; task: { user_id: string } } | null;

    if (checkError || !subtask) {
      return NextResponse.json(
        { error: "Subtask not found" },
        { status: 404 }
      );
    }

    // Check ownership
    const taskData = subtask.task;
    if (taskData.user_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("subtasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting subtask:", error);
      return NextResponse.json(
        { error: "Failed to delete subtask" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subtask API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
