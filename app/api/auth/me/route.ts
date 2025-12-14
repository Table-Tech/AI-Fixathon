import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import type { Profile } from "@/types";

// Helper to create auth client for user verification
function createAuthClient(accessToken: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}

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
    const authClient = createAuthClient(token);

    const { data: { user }, error: userError } = await authClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Use server client for DB operations
    const supabase = createServerClient();

    // Get profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const profile = profileData as Profile | null;

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
    const authClient = createAuthClient(token);

    const { data: { user }, error: userError } = await authClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    // Use server client for DB operations
    const supabase = createServerClient();

    // Update profile - use type assertion for update
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profileData, error: updateError } = await (supabase as any)
      .from("profiles")
      .update({ name })
      .eq("id", user.id)
      .select()
      .single();

    const profile = profileData as Profile | null;

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
