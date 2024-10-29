import React, { memo, useState, useCallback } from "react";
import { Checkbox } from "../ui/checkbox";
import { Todo } from "@/types";
import { Button } from "../ui/button";
import { CheckIcon, Pen, Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { updateTodo } from "@/utils/features/todos";
import { Input } from "../ui/input";
import { useUserSession } from "@/utils/zustandHooks/userSession";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [newTask, setNewTask] = useState(todo.task);
  const session = useUserSession((state) => state.session);

  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: number;
      updates: Partial<Omit<Todo, "id" | "created_at">>;
    }) => {
      return updateTodo(data.id, data.updates);
    },
  });

  const handleCheckboxChange = useCallback(
    async (checked: boolean) => {
      const updates = { completed: checked };
      await updateMutation.mutateAsync({ id: todo.id, updates });
    },
    [todo.id, updateMutation]
  );

  const handleTaskUpdate = useCallback(async () => {
    const updates = { task: newTask };
    await updateMutation.mutateAsync({ id: todo.id, updates });
    setIsEditable(false);
  }, [newTask, todo.id, updateMutation]);

  const handleDelete = useCallback(async () => {
    await updateMutation.mutateAsync({
      id: todo.id,
      updates: { deleted: true },
    });
  }, [todo.id, updateMutation]);

  const toggleEdit = () => setIsEditable((prev) => !prev);

  if (todo.deleted) return null;

  return (
    <div
      key={todo.id}
      className={`flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-4 px-6 rounded-md ${updateMutation.isPending ? "!cursor-wait" : "cursor-auto"}`}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={handleCheckboxChange}
      />
      {isEditable ? (
        <Input value={newTask} onChange={(e) => setNewTask(e.target.value)} />
      ) : (
        <p className={`text-sm w-full ${todo.completed ? "line-through" : ""}`}>
          {newTask}
        </p>
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
        variant="outline"
        size="icon"
        onClick={isEditable ? handleTaskUpdate : toggleEdit}
      >
        {isEditable ? <CheckIcon size={16} /> : <Pen size={16} />}
      </Button>
      <Button
        className="min-w-8 min-h-8"
        variant="destructive"
        size="icon"
        onClick={handleDelete}
      >
        <Trash size={16} />
      </Button>
    </div>
  );
};

export default memo(TodoItem);
