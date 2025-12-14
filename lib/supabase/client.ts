import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

// Browser-side Supabase client
// Using untyped client to avoid type issues with dynamic schema
export const supabase = createClient(supabaseUrl, supabaseKey);
