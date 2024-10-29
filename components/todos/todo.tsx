import React, { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Todo } from "@/types";
import { Button } from "../ui/button";
import { CheckIcon, Pen, Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteTodo, updateTodo } from "@/utils/features/todos";
import { Input } from "../ui/input";
import { useUserSession } from "@/utils/zustandHooks/userSession";
import { Avatar, AvatarFallback } from "../ui/avatar";

const TodoItem = ({ todo }: { todo: Todo }) => {
  const [isEditible, setIsEditible] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<string>(todo.task);
  const session = useUserSession((state) => state.session);

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<Omit<Todo, "id" | "created_at">>;
    }) => {
      return updateTodo(id, updates);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return deleteTodo(id);
    },
  });

  const handleCheckboxChange = async (e: boolean) => {
    const updates = {
      completed: e,
    };

    await updateMutation.mutateAsync({ id: todo.id, updates });
  };

  const handleTaskUpdate = async () => {
    const updates = {
      task: newTask,
    };

    await updateMutation.mutateAsync({ id: todo.id, updates });
    setIsEditible(false);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(todo.id);
  };

  return (
    <>
      <div
        key={todo.id}
        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-4 px-6 rounded-md"
      >
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleCheckboxChange}
        />
        {!isEditible ? (
          <p
            className={`text-sm w-full ${todo.completed ? "line-through" : ""}`}
          >
            {newTask}
          </p>
        ) : (
          <Input value={newTask} onChange={(e) => setNewTask(e.target.value)} />
        )}

        {session?.id === todo.created_by && (
          <Avatar
            title={session.email}
            className="w-8 h-8 text-sm cursor-default"
          >
            <AvatarFallback>{session.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
        <Button
          className="min-w-8 min-h-8"
          variant={"outline"}
          size={"icon"}
          onClick={() =>
            isEditible ? handleTaskUpdate() : setIsEditible(true)
          }
        >
          {isEditible ? <CheckIcon size={16} /> : <Pen size={16} />}
        </Button>
        <Button
          className="min-w-8 min-h-8"
          variant={"destructive"}
          size={"icon"}
          onClick={handleDelete}
        >
          <Trash size={16} />
        </Button>
      </div>
    </>
  );
};

export default TodoItem;
