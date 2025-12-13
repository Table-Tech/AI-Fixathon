import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to profile page after successful auth
  return NextResponse.redirect(new URL("/profiel", requestUrl.origin));
}
