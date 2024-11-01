import { Todo } from "@/types";
import { createClient } from "../supabase/client";

// Initialize the Supabase client
const supabase = createClient();

// Function to fetch todos
export async function getTodos({ id }: { id?: string }): Promise<Todo[]> {
  const supbase = createClient();
  const uid = id || (await supabase.auth.getUser()).data.user?.id;

  const { data, error } = await supbase
    .from("todos")
    .select("*")
    .filter("owner_id", "eq", uid)
    .filter("deleted", "eq", false)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Function to add a new todo
export async function addTodo({
  task,
  assigned_to,
  created_by,
  owner_id,
}: {
  task: string;
  assigned_to: string[];
  created_by: string;
  owner_id: string;
}): Promise<Todo | null> {
  const { data, error } = await supabase.from("todos").insert([
    {
      task,
      completed: false, // default to not completed
      assigned_to,
      created_by,
      owner_id,
    },
  ]);

  if (error) {
    throw new Error(`Error adding todo: ${error.message}`);
  }

  return data;
}

// Function to update an existing todo
export async function updateTodo(
  id: number,
  updates: Partial<Omit<Todo, "id" | "created_at">> // Optional fields except 'id' and 'created_at'
): Promise<Todo[]> {
  const { data, error } = await supabase
    .from("todos")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(`Error updating todo: ${error.message}`);
  }

  return data;
}
