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

const EnterTask = () => {
  const [task, setTask] = useState("");
  const [assignedTo, setAssignedTo] = useState<string[]>([]); // Assuming you want to assign tasks to users
  const session = useUserSession((state) => state.session);
  const roomId = useRoomId((state) => state.roomId);

  // Define the mutation for adding a todo
  const addTodoMutation = useMutation({ mutationFn: addTodo });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() === "" || !session?.id) return; // Prevent empty submissions

    // Add the todo
    addTodoMutation.mutate({
      task,
      assigned_to: assignedTo,
      created_by: session.id,
      owner_id: roomId ? roomId : session.id, // If there is a room ID, use it, otherwise use the session ID
    });

    // Reset the form
    setTask("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="h-10"
        />
        {/* <Select>
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="Assign To" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">None</SelectItem>
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
