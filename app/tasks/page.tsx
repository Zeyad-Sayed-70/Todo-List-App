"use client";
import Connections from "@/components/todos/connections";
import EnterTask from "@/components/todos/enterTask";
import TodosList from "@/components/todos/todosList";
import Loading from "@/components/ui/loading";
import { Todo } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { useConnections } from "@/utils/zustandHooks/connections";
import { useRoomId } from "@/utils/zustandHooks/roomId";
import { useTodos } from "@/utils/zustandHooks/todos";
import { useUserSession } from "@/utils/zustandHooks/userSession";
import { useSearchParams } from "next/navigation";
import React from "react";

const supabase = createClient();

const Page = () => {
  const initUserSession = useUserSession((state) => state.initUserSession);
  const { updateTodosData, deleteTodoData, insetTodoData } = useTodos();
  const { initConnections, initConnected, updateConnectionsData } =
    useConnections();
  const { setLoading, setRoomId, isLoading } = useRoomId();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  React.useEffect(() => {
    initUserSession();
    initConnections();
    initConnected();
  }, []);

  React.useEffect(() => {
    const channel = supabase
      .channel("todos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todos" },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              insetTodoData(payload.new as Todo);
              break;
            case "UPDATE":
              updateTodosData(payload.new.id, payload.new as Todo);
              break;
            case "DELETE":
              deleteTodoData(payload.old.id);
              break;
          }
        }
      )
      .subscribe();

    // Clean up the subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  React.useEffect(() => {
    const channel = supabase
      .channel("connections")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "connections" },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              updateConnectionsData(payload.new.connectors);
              break;
            case "UPDATE":
              updateConnectionsData(payload.new.connectors);
              break;
          }
        }
      )
      .subscribe();

    // Clean up the subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  React.useEffect(() => {
    if (roomId) {
      setRoomId(roomId);
    } else {
      setLoading(false);
    }
  }, [roomId]);

  if (isLoading) return <Loading />;

  return (
    <main className="w-full sm:w-[500px]">
      <Connections />
      <EnterTask />
      <TodosList />
    </main>
  );
};

export default Page;
