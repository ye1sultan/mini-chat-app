import { create } from "zustand";
import { initWebSocket } from "../hooks/useWebSocket";

interface IUser {
  name: string;
}

interface IAuthStore {
  user: IUser | null;
  login: (user: IUser) => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  user: null,
  login: (user) => {
    set({ user });
    initWebSocket(user.name);
  },
}));
