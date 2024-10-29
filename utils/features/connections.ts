import { createClient } from "../supabase/client";

// Initialize the Supabase client
const supabase = createClient();

// Function to fetch connections
export async function getConnections(): Promise<any> {
  const { data, error } = await supabase
    .from("connections")
    .select("connectors")
    .filter("uid", "eq", (await supabase.auth.getUser()).data.user?.id);

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

// Function to add a new connection
export async function addConnection({
  uid,
  cid,
}: {
  uid: string;
  cid: string;
}): Promise<void> {
  // check if connection already exists
  const { data, error } = await supabase
    .from("connections")
    .select("*")
    .filter("uid", "eq", uid);

  if (error) {
    throw new Error(error.message);
  }

  if (!data.length) {
    // create new connection if it doesn't exist
    const { error } = await supabase
      .from("connections")
      .insert([{ uid, connectors: [cid] }]);
    if (error) {
      throw new Error(error.message);
    }
  } else {
    // add cid to existing connection
    const { error } = await supabase
      .from("connections")
      .update({ connectors: [...data[0].connectors, cid] })
      .eq("uid", uid);
    if (error) {
      throw new Error(error.message);
    }
  }
}

// Function to delete a connection
export async function deleteConnection({
  uid,
  cid,
}: {
  uid: string;
  cid: string;
}): Promise<void> {
  const { data, error } = await supabase
    .from("connections")
    .select("*")
    .filter("uid", "eq", uid);

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Connection not found");
  }

  // delete cid from connection
  const { error: update_error } = await supabase
    .from("connections")
    .update({
      connectors: [...data[0].connectors.filter((c: string) => c !== cid)],
    })
    .eq("uid", uid);

  if (update_error) {
    throw new Error(update_error.message);
  }
}
