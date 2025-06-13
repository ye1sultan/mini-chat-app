// useMessageStore.ts
import { create } from "zustand";

interface IMessage {
  from: string;
  to: string;
  text: string;
  read: boolean;
  timestamp: number;
}

interface IMessageStore {
  messagesByUser: Record<string, IMessage[]>;
  addMessage: (from: string, to: string, text: string) => void;
  markMessagesAsRead: (from: string, to: string) => void;
}

export const useMessageStore = create<IMessageStore>((set) => ({
  messagesByUser: {},
  addMessage: (from, to, text) =>
    set((state) => {
      const key = from === to ? from : [from, to].sort().join("_");
      const updated = [
        ...(state.messagesByUser[key] || []),
        { from, to, text, read: false, timestamp: Date.now() },
      ];
      return {
        messagesByUser: {
          ...state.messagesByUser,
          [key]: updated,
        },
      };
    }),
  markMessagesAsRead: (from: string, to: string) =>
    set((state) => {
      const key = [from, to].sort().join("_");
      const updated = (state.messagesByUser[key] || []).map((msg) => {
        if (msg.from === from && msg.to === to && !msg.read) {
          return { ...msg, read: true };
        }
        return msg;
      });

      return {
        messagesByUser: {
          ...state.messagesByUser,
          [key]: updated,
        },
      };
    }),
}));
