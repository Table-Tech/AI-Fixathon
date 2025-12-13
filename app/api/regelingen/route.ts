import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// GET /api/regelingen - List all active regelingen
export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);

    // Optional filters
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let query = supabase
      .from("regelingen")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    // Filter by category if provided
    if (category) {
      query = query.contains("details", { category });
    }

    // Search by title if provided
    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching regelingen:", error);
      return NextResponse.json(
        { error: "Failed to fetch regelingen" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Regelingen API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
