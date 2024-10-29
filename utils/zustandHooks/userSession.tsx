import { create } from "zustand";
import { createClient } from "../supabase/client";
import { User } from "@supabase/supabase-js";

export interface UserSessionState {
  session: null | User;
  initUserSession: () => void;
}

export const useUserSession = create<UserSessionState>((set) => ({
  session: null,
  initUserSession: async () => {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      set({ session: null });
      return;
    }

    set({ session: user });
  },
}));
