import { supabase } from "@/lib/supabase";

// API helper functions
// Once you define tables in types/database.ts, you can use these patterns:

// Example usage (uncomment and modify when you have tables):
//
// export async function getUsers() {
//   const { data, error } = await supabase.from("users").select("*");
//   if (error) throw error;
//   return data;
// }
//
// export async function createUser(email: string) {
//   const { data, error } = await supabase.from("users").insert({ email }).select().single();
//   if (error) throw error;
//   return data;
// }

// Re-export supabase for direct access if needed
export { supabase };
