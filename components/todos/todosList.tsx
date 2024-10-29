import { getTodos } from "@/utils/features/todos";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import TodoItem from "./todo";
import Loading from "../ui/loading";
import { FormMessage } from "../form-message";
import { useTodos } from "@/utils/zustandHooks/todos";
import { useRoomId } from "@/utils/zustandHooks/roomId";

const TodosList = () => {
  const { roomId, isLoading: roomIsLoading } = useRoomId();
  const {
    data: todos,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: () => getTodos({ id: roomId as string | undefined }),
  });
  const { todosData, setTodosData } = useTodos();

  React.useEffect(() => {
    if (todos) setTodosData(todos);
  }, [todos]);

  React.useEffect(() => {
    refetch();
  }, [roomId, roomIsLoading]);

  // Use useMemo to create the list of TodoItem components
  const todosList = useMemo(
    () =>
      todosData && todosData.length > 0
        ? todosData.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        : [],
    [todosData]
  );

  if (isLoading || roomIsLoading) return <Loading />;
  if (error) return <FormMessage message={error} />;

  return (
    <section className="pt-4 pb-6 flex flex-col gap-2">{todosList}</section>
  );
};

export default TodosList;
