import { createServerClient } from "@/lib/supabase/server";
import type { RiskLevel } from "@/types/database";

interface AuditLogEntry {
  userId?: string | null;
  action: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  riskLevel?: RiskLevel;
}

/**
 * Log an action to the audit trail
 * Use this for tracking important user actions for transparency
 */
export async function logAudit({
  userId,
  action,
  resourceType,
  resourceId,
  details = {},
  riskLevel = "low",
}: AuditLogEntry) {
  try {
    const supabase = createServerClient();

    const { error } = await supabase.from("audit_log").insert({
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      risk_level: riskLevel,
    });

    if (error) {
      console.error("Failed to log audit entry:", error);
    }
  } catch (err) {
    // Don't throw - audit logging should not break the main flow
    console.error("Audit logging error:", err);
  }
}

// Common audit actions
export const AuditActions = {
  // Task actions
  TASK_CREATED: "task.created",
  TASK_UPDATED: "task.updated",
  TASK_DELETED: "task.deleted",
  TASK_COMPLETED: "task.completed",

  // Subtask actions
  SUBTASK_CREATED: "subtask.created",
  SUBTASK_COMPLETED: "subtask.completed",

  // Regeling actions
  REGELING_VIEWED: "regeling.viewed",
  REGELING_ADDED_TO_PLAN: "regeling.added_to_plan",

  // Chat actions
  CHAT_MESSAGE_SENT: "chat.message_sent",
  RECOMMENDATION_VIEWED: "recommendation.viewed",

  // Profile actions
  PROFILE_UPDATED: "profile.updated",
  CONSENT_GRANTED: "consent.granted",
  CONSENT_REVOKED: "consent.revoked",

  // Draft actions
  DRAFT_GENERATED: "draft.generated",
  DRAFT_EXPORTED: "draft.exported",
} as const;
