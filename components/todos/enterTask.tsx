import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTodo } from "@/utils/features/todos";
import { useUserSession } from "@/utils/zustandHooks/userSession";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormMessage } from "../form-message";
import { useRoomId } from "@/utils/zustandHooks/roomId";

// Define the types for the todo item being added
type TodoData = {
  task: string;
  assigned_to: string[];
  created_by: string;
  owner_id: string;
};

const EnterTask: React.FC = () => {
  const [task, setTask] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const session = useUserSession((state) => state.session);
  const roomId = useRoomId((state) => state.roomId);

  // Define the mutation for adding a todo
  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      setTask(""); // Clear task input on success
      setAssignedTo([]); // Clear assignments
    },
    onError: (error) => {
      console.error("Error adding task:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim() || !session?.id) return; // Prevent empty submissions

    const todoData: TodoData = {
      task,
      assigned_to: assignedTo,
      created_by: session.id,
      owner_id: roomId ?? session.id,
    };

    addTodoMutation.mutate(todoData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="h-10"
        />
        {/* Uncomment and extend this section to allow assignment selection */}
        {/* <Select onValueChange={(value) => setAssignedTo([value])}>
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="Assign To" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="User1">User1</SelectItem>
            <SelectItem value="User2">User2</SelectItem>
          </SelectContent>
        </Select> */}
        <Button
          type="submit"
          disabled={addTodoMutation.isPending}
          className="h-10"
        >
          {addTodoMutation.isPending ? "Adding..." : "Add"}
        </Button>
      </div>
      {addTodoMutation.isError && (
        <FormMessage message={addTodoMutation.error} />
      )}
    </form>
  );
};

export default EnterTask;
