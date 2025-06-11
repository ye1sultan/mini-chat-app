import { useEffect, useRef } from "react";
import { Alert } from "react-native";
import { useChatStore } from "../stores/useChatStore";
import { IMessage } from "../types/message";

const WS_URL = "ws://192.168.88.77:3000";

export function useWebSocket(userId: string) {
  const initializedRef = useRef(false);
  const socketRef = useRef<WebSocket | null>(null);
  const { setMessages, addMessage } = useChatStore.getState();

  useEffect(() => {
    if (initializedRef.current) return;

    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket opened");
      socket.send(JSON.stringify({ type: "init", userId }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);

      if (data.type === "history") {
        const formatted = (data.messages || []).map((msg: any) => ({
          ...msg,
          sender: msg.from === userId ? "me" : "them",
        }));

        const grouped = formatted.reduce(
          (acc: Record<string, any[]>, msg: any) => {
            const chatId = [msg.from, msg.to].sort().join("_");
            acc[chatId] = [...(acc[chatId] || []), msg];
            return acc;
          },
          {}
        );

        for (const [chatId, msgs] of Object.entries(grouped)) {
          setMessages(chatId, msgs as IMessage[]);
        }
      }

      if (data.type === "message") {
        const chatId = [data.from, data.to].sort().join("_");
        const formatted = {
          ...data,
          sender: data.from === userId ? "me" : "them",
        };

        addMessage(chatId, formatted);

        if (data.to === userId) {
          socket.send(
            JSON.stringify({
              type: "read",
              chatId,
              messageId: data.id,
            })
          );
        }
      }

      if (data.type === "read") {
        useChatStore.getState().markAsRead(data.chatId, data.messageId);
      }
    };

    socket.onerror = (e) => {
      Alert.alert("WebSocket error", JSON.stringify(e));
    };

    initializedRef.current = true;

    return () => {
      socket?.close();
    };
  }, [userId]);

  const sendMessage = (to: string, message: any) => {
    const socket = socketRef.current;

    if (socket?.readyState === WebSocket.OPEN) {
      console.log("Sending message:", { from: userId, to, ...message });
      socket.send(
        JSON.stringify({
          type: "message",
          from: userId,
          to,
          ...message,
        })
      );
    } else {
      console.warn("WebSocket not open");
    }
  };

  return { sendMessage, socket: socketRef.current };
}
