import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUsers } from "@/utils/features/users";
import { useUserSession } from "@/utils/zustandHooks/userSession";
import { Button } from "../ui/button";
import { useConnections } from "@/utils/zustandHooks/connections";
import { LogOutIcon, Trash } from "lucide-react";
import NotFoundMessage from "../ui/notFoundMessage";
import { FormMessage } from "../form-message";
import { addConnection, deleteConnection } from "@/utils/features/connections";
import Loading from "../ui/loading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EnterIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRoomId } from "@/utils/zustandHooks/roomId";

const Connections = () => {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({ queryFn: getUsers, queryKey: ["users"] });
  const addConnectionMutation = useMutation({
    mutationFn: addConnection,
    mutationKey: ["connections"],
  });
  const deleteConnectionMutation = useMutation({
    mutationFn: deleteConnection,
    mutationKey: ["connections"],
  });
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(
    null
  );
  const { connectionsData, connectedData } = useConnections();
  const roomId = useRoomId((state) => state.roomId);
  const session = useUserSession((state) => state.session);

  const handleAddConnection = () => {
    if (!selectedUserId || !session) return;
    addConnectionMutation.mutate({
      uid: session.id,
      cid: selectedUserId,
    });

    setSelectedUserId(null);
  };

  const handleDeleteConnection = (cid: string) => {
    if (!session) return;
    deleteConnectionMutation.mutate({
      uid: session.id,
      cid,
    });
  };

  const removeAllQueries = () => {
    // This will remove all query parameters from the URL
    window.history.replaceState(null, "", window.location.pathname);
  };

  if (error) return <FormMessage message={error} />;

  const currentRoomEmail = connectedData?.find(
    (user) => user.id === roomId
  )?.email;

  return (
    <section className="flex flex-col gap-2 mb-6">
      <h1 className="text-lg font-bold mb-2">
        Room Owner: {currentRoomEmail || "Me"}
      </h1>
      <label htmlFor="connections" className="flex flex-col">
        <span className="text-sm font-semibold">Connections</span>
        <span className="text-xs text-gray-500">
          Users who can access to your todos.
        </span>
      </label>
      <div className="flex gap-2">
        <Select
          value={selectedUserId as string | undefined}
          onValueChange={setSelectedUserId}
        >
          <SelectTrigger id="connections" disabled={isLoading}>
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {users?.map(
              (user) =>
                user.id !== session?.id &&
                connectionsData.findIndex((u) => u.id === user.id) === -1 && (
                  <SelectItem key={user.id} value={user.id}>
                    {user.email}
                  </SelectItem>
                )
            )}
          </SelectContent>
        </Select>
        <Button variant={"outline"} onClick={handleAddConnection}>
          Add
        </Button>
      </div>
      <div>
        {isLoading && <Loading />}

        <Accordion type="single" collapsible>
          <AccordionItem value={"connections"}>
            <AccordionTrigger>Your Connections:</AccordionTrigger>
            <AccordionContent>
              {!isLoading && connectionsData.length === 0 && (
                <NotFoundMessage msg="No connections found." />
              )}
              {connectionsData.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-2 text-sm bg-gray-100 dark:bg-slate-900 p-2 px-4 rounded-md"
                >
                  <span>{user.email}</span>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={() => handleDeleteConnection(user.id)}
                    className="w-7 h-7"
                  >
                    <Trash size={12} />
                  </Button>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value={"connected"}>
            <AccordionTrigger>You Connected In:</AccordionTrigger>
            <AccordionContent>
              {!isLoading && connectedData.length === 0 && (
                <NotFoundMessage msg="You are not connected in any user." />
              )}
              {connectedData.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-2 text-sm bg-gray-100 dark:bg-slate-900 p-2 px-4 rounded-md"
                >
                  <Link
                    href={{ query: { roomId: user.id } }}
                    className="hover:underline"
                  >
                    {user.email}
                  </Link>
                  {roomId === user.id && (
                    <Link href={{ query: { roomId: session?.id } }}>
                      <Button
                        variant={"destructive"}
                        size={"icon"}
                        className="w-7 h-7"
                        onClick={removeAllQueries}
                      >
                        <LogOutIcon size={12} />
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default Connections;
