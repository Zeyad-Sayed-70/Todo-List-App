import { create } from "zustand";

interface RoomIdState {
  roomId: string | null;
  isLoading: boolean;
  setRoomId: (roomId: string) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useRoomId = create<RoomIdState>((set) => ({
  roomId: null,
  isLoading: true,
  setRoomId: (roomId: string) => {
    set({ roomId, isLoading: false });
  },
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));
