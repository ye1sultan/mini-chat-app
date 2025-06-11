import { create } from "zustand";
import { IChatStore } from "../types/message";

export const useChatStore = create<IChatStore>((set) => ({
  chats: {},
  setMessages: (chatId, messages) =>
    set((state) => ({
      chats: {
        ...state.chats,
        [chatId]: messages,
      },
    })),
  addMessage: (chatId, message) =>
    set((state) => {
      const exists = (state.chats[chatId] || []).some(
        (m) => m.id === message.id
      );
      if (exists) return {};
      return {
        chats: {
          ...state.chats,
          [chatId]: [...(state.chats[chatId] || []), message],
        },
      };
    }),
  markAsRead: (chatId: string, messageId: string) =>
    set((state) => ({
      chats: {
        ...state.chats,
        [chatId]: state.chats[chatId]?.map((msg) =>
          msg.id === messageId ? { ...msg, read: true } : msg
        ),
      },
    })),
}));
