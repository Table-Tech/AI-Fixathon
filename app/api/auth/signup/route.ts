import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// POST /api/auth/signup - Create a new account
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || null, // Name is optional for privacy
        },
      },
    });

    if (error) {
      console.error("Signup error:", error);

      if (error.message.includes("already registered")) {
        return NextResponse.json(
          { error: "Dit e-mailadres is al geregistreerd" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Registratie mislukt. Probeer het opnieuw." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        user: data.user,
        session: data.session,
      },
      message: "Account aangemaakt!",
    });
  } catch (err) {
    console.error("Signup API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
