import { createClient } from "@/utils/supabase/client";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";

export const signInWithGithub = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/tasks");
};
