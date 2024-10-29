import { getTodos } from "@/utils/features/todos";
import { useQuery } from "@tanstack/react-query";
import React from "react";
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

  if (isLoading || roomIsLoading) return <Loading />;
  if (error) return <FormMessage message={error} />;

  return (
    <section className="pt-4 pb-6 flex flex-col gap-2">
      {todosData?.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
    </section>
  );
};

export default TodosList;
