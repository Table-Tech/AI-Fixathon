import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { logAudit, AuditActions } from "@/lib/audit";
import type { Regeling } from "@/types";

// GET /api/regelingen/[slug] - Get single regeling by slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createServerClient();

    const { data: regelingData, error } = await supabase
      .from("regelingen")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    const data = regelingData as Regeling | null;

    if (error || !data) {
      if (error?.code === "PGRST116" || !data) {
        return NextResponse.json(
          { error: "Regeling not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching regeling:", error);
      return NextResponse.json(
        { error: "Failed to fetch regeling" },
        { status: 500 }
      );
    }

    // Log view for audit (anonymous)
    await logAudit({
      action: AuditActions.REGELING_VIEWED,
      resourceType: "regeling",
      resourceId: data.id,
      details: { slug },
      riskLevel: "low",
    });

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Regeling API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
