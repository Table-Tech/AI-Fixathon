import { NextResponse } from "next/server";
import { createServerClientWithAuth } from "@/lib/supabase/server";
import { headers } from "next/headers";

// GET /api/auth/me - Get current user and profile
export async function GET() {
  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createServerClientWithAuth(token);

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }

    return NextResponse.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        profile: profile || null,
        // Display name: use profile name, or "Mama" if not set
        displayName: profile?.name || "Mama",
      },
    });
  } catch (err) {
    console.error("Auth me API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/auth/me - Update profile
export async function PATCH(request: Request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createServerClientWithAuth(token);

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    // Update profile
    const { data: profile, error: updateError } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        profile,
        displayName: profile?.name || "Mama",
      },
    });
  } catch (err) {
    console.error("Auth me API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
