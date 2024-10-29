import { Connector } from "@/types";
import { create } from "zustand";
import { createClient } from "../supabase/client";

interface ConnectionsState {
  connectionsData: Connector[];
  connectedData: Connector[];
  setConnectionsData: (connections: Connector[]) => void;
  setConnectedData: (connections: Connector[]) => void;
  initConnections: () => void;
  initConnected: () => void;
  updateConnectionsData: (newConnectors: any) => void;
}

export const useConnections = create<ConnectionsState>((set) => ({
  connectionsData: [],
  connectedData: [],
  setConnectionsData: (connections: Connector[]) => {
    set({ connectionsData: connections });
  },
  setConnectedData: (connections: Connector[]) => {
    set({ connectedData: connections });
  },
  initConnections: () => {
    (async function () {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Get connections data
        const { data, error } = await supabase
          .from("connections")
          .select("connectors")
          .filter("uid", "eq", user.id);

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          // Get users data from thier ids (connectors array)
          const { data: users, error } = await supabase
            .from("user_view")
            .select("*")
            .in("id", data[0].connectors);

          if (error) {
            throw new Error(error.message);
          }

          // Set state
          set({ connectionsData: users });
        }
      }
    })();
  },
  initConnected: () => {
    (async function () {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Get connections data that who add me to his connections
        const { data, error } = await supabase
          .from("connections")
          .select("uid")
          .contains("connectors", [user.id]);

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          // Get users data from thier ids (connectors array)
          const { data: users, error } = await supabase
            .from("user_view")
            .select("*")
            .filter("id", "eq", data[0].uid);

          if (error) {
            throw new Error(error.message);
          }

          // Set state
          set({ connectedData: users });
        }
      }
    })();
  },
  updateConnectionsData: (newConnectors: any) => {
    (async function () {
      const supabase = createClient();
      // Get users data from thier ids (connectors array)
      const { data: users, error } = await supabase
        .from("user_view")
        .select("*")
        .in("id", newConnectors);

      if (error) {
        throw new Error(error.message);
      }

      // Set state
      set({ connectionsData: users });
    })();
  },
}));
