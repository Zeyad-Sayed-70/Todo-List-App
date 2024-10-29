"use client";
import React, { useCallback, useEffect, useMemo } from "react";
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

const Page = () => {
  const { initUserSession, session } = useUserSession();
  const { updateTodosData, deleteTodoData, insetTodoData } = useTodos();
  const { initConnections, initConnected, updateConnectionsData } =
    useConnections();
  const { setLoading, setRoomId, isLoading } = useRoomId();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  // Memoize supabase client to avoid recreating on every render
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    initUserSession();
    initConnections();
    initConnected();
  }, [initUserSession, initConnections, initConnected]);

  // Memoize the payload handler to avoid recreating on each render
  const handleTodosPayload = useCallback(
    (payload: any) => {
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
    },
    [insetTodoData, updateTodosData, deleteTodoData]
  );

  useEffect(() => {
    const channel = supabase.channel("todos");

    // Subscribe to changes in the "todos" table
    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "todos",
          filter: roomId
            ? `owner_id=eq.${roomId}`
            : `owner_id=eq.${session?.id}`,
        },
        handleTodosPayload
      )
      .subscribe();

    // Clean up the subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, session, roomId]);

  // Memoize the payload handler for connections
  const handleConnectionsPayload = useCallback(
    (payload: any) => {
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        updateConnectionsData(payload.new.connectors);
      }
    },
    [updateConnectionsData]
  );

  useEffect(() => {
    const channel = supabase
      .channel("connections")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "connections" },
        handleConnectionsPayload
      )
      .subscribe();

    // Clean up the subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, handleConnectionsPayload]);

  useEffect(() => {
    if (roomId) {
      setRoomId(roomId);
    } else {
      setLoading(false);
    }
  }, [roomId, setRoomId, setLoading]);

  if (isLoading) return <Loading />;

  return (
    <main className="w-full sm:w-[500px]">
      <Connections />
      <EnterTask />
      <TodosList />
    </main>
  );
};

export default React.memo(Page);
