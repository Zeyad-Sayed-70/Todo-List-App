import React, { useState, useCallback } from "react";
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
import Link from "next/link";
import { useRoomId } from "@/utils/zustandHooks/roomId";
import { Connector } from "@/types";

// Define types for User and Props

type User = {
  id: string;
  email: string;
};

type UserSelectDropdownProps = {
  users: User[] | undefined;
  isLoading: boolean;
  selectedUserId: string | null;
  session: User | null;
  connectionsData: Connector[];
  setSelectedUserId: React.Dispatch<React.SetStateAction<string | null>>;
  onAddConnection: () => void;
};

type ConnectionsListProps = {
  connectionsData: User[];
  onDeleteConnection: (cid: string) => void;
};

type ConnectedInListProps = {
  connectedData: User[];
  roomId: string | null;
  sessionId: string | undefined;
  onLogOut: () => void;
};

// Separate component for user selection dropdown
const UserSelectDropdown: React.FC<UserSelectDropdownProps> = ({
  users,
  session,
  isLoading,
  selectedUserId,
  connectionsData,
  setSelectedUserId,
  onAddConnection,
}) => (
  <div className="flex gap-2">
    <Select
      value={selectedUserId || ""}
      onValueChange={setSelectedUserId}
      disabled={isLoading}
    >
      <SelectTrigger id="connections">
        <SelectValue placeholder="Select a user" />
      </SelectTrigger>
      <SelectContent>
        {users?.map(
          (user) =>
            user.id !== session?.id &&
            connectionsData.findIndex((c) => c.id === user.id) === -1 && (
              <SelectItem key={user.id} value={user.id}>
                {user.email}
              </SelectItem>
            )
        )}
      </SelectContent>
    </Select>
    <Button
      variant="outline"
      onClick={onAddConnection}
      disabled={!selectedUserId}
    >
      Add
    </Button>
  </div>
);

// Separate component for displaying connections
const ConnectionsList: React.FC<ConnectionsListProps> = ({
  connectionsData,
  onDeleteConnection,
}) => (
  <AccordionContent>
    {connectionsData.length === 0 ? (
      <NotFoundMessage msg="No connections found." />
    ) : (
      connectionsData.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between gap-2 text-sm bg-gray-100 dark:bg-slate-900 p-2 px-4 rounded-md"
        >
          <span>{user.email}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDeleteConnection(user.id)}
            className="w-7 h-7"
          >
            <Trash size={12} />
          </Button>
        </div>
      ))
    )}
  </AccordionContent>
);

// Separate component for connected-in list
const ConnectedInList: React.FC<ConnectedInListProps> = ({
  connectedData,
  roomId,
  onLogOut,
}) => (
  <AccordionContent>
    {connectedData.length === 0 ? (
      <NotFoundMessage msg="You are not connected in any user." />
    ) : (
      connectedData.map((user) => (
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
            <Button
              variant="destructive"
              size="icon"
              className="w-7 h-7"
              onClick={onLogOut}
            >
              <LogOutIcon size={12} />
            </Button>
          )}
        </div>
      ))
    )}
  </AccordionContent>
);

const Connections: React.FC = () => {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({ queryFn: getUsers, queryKey: ["users"] });
  const addConnectionMutation = useMutation({
    mutationFn: addConnection,
    mutationKey: ["addConnection"],
  });
  const deleteConnectionMutation = useMutation({
    mutationFn: deleteConnection,
    mutationKey: ["deleteConnection"],
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { connectionsData, connectedData } = useConnections();
  const roomId = useRoomId((state) => state.roomId);
  const session = useUserSession((state) => state.session);

  const handleAddConnection = useCallback(() => {
    if (!selectedUserId || !session) return;
    addConnectionMutation.mutate({
      uid: session.id,
      cid: selectedUserId,
    });
    setSelectedUserId(null);
  }, [selectedUserId, session, addConnectionMutation]);

  const handleDeleteConnection = useCallback(
    (cid: string) => {
      if (!session) return;
      deleteConnectionMutation.mutate({
        uid: session.id,
        cid,
      });
    },
    [session, deleteConnectionMutation]
  );

  const handleLogOut = () => {
    window.history.replaceState(null, "", window.location.pathname);
    window.location.reload();
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
          Users who can access your todos.
        </span>
      </label>

      <UserSelectDropdown
        users={users as User[]}
        session={session as User}
        isLoading={isLoading}
        selectedUserId={selectedUserId}
        connectionsData={connectionsData}
        setSelectedUserId={setSelectedUserId}
        onAddConnection={handleAddConnection}
      />

      <div>
        {isLoading && <Loading />}

        <Accordion type="single" collapsible>
          <AccordionItem value="connections">
            <AccordionTrigger>Your Connections:</AccordionTrigger>
            <ConnectionsList
              connectionsData={connectionsData}
              onDeleteConnection={handleDeleteConnection}
            />
          </AccordionItem>
          <AccordionItem value="connected">
            <AccordionTrigger>You Connected In:</AccordionTrigger>
            <ConnectedInList
              connectedData={connectedData}
              roomId={roomId}
              sessionId={session?.id}
              onLogOut={handleLogOut}
            />
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default Connections;
