import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// POST /api/auth/login - Login with email/password
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);

      if (error.message.includes("Invalid login credentials")) {
        return NextResponse.json(
          { error: "Onjuist e-mailadres of wachtwoord" },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: "Inloggen mislukt. Probeer het opnieuw." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        user: data.user,
        session: data.session,
      },
    });
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
