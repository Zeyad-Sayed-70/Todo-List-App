import { User } from "@supabase/supabase-js";

export type Todo = {
  id: number;
  task: string;
  completed: boolean;
  assigned_to: string[];
  created_by: string;
  created_at: Date;
  owner_id: string;
  deleted: boolean;
};

export type Connector = {
  id: string;
  email: string;
};
