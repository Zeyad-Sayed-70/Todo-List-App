import { User } from "@supabase/supabase-js";
import { createClient } from "../supabase/client";

// Initialize the Supabase client
const supabase = createClient();

// Function to fetch users
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("user_view").select("*");

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
