import { create } from "zustand";

export const useUserStore = create<{
  userId: string;
  setUserId: (id: string) => void;
}>((set) => ({
  userId: "",
  setUserId: (id) => set({ userId: id }),
}));
