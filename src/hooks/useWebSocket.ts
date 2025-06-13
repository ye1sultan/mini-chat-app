import { useMessageStore } from "../stores/useMessageStore";

let ws: WebSocket | null = null;

const WS_URL = "ws://192.168.1.4:3000";

export const initWebSocket = (username: string) => {
  const addMessage = useMessageStore.getState().addMessage;

  if (
    ws &&
    (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log("🔌 WebSocket connected");
    ws?.send(JSON.stringify({ type: "login", name: username }));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === "message") {
        addMessage(data.from, username, data.text);
      }

      if (data.type === "read") {
        const markMessagesAsRead =
          useMessageStore.getState().markMessagesAsRead;
        markMessagesAsRead(data.from, data.to);
      }
    } catch (err) {
      console.error("🧨 Failed to parse WebSocket message:", err);
    }
  };

  ws.onclose = () => {
    console.log("❌ WebSocket closed. Reconnecting...");
    ws = null;
    setTimeout(() => initWebSocket(username), 3000);
  };
};

export const sendMessage = (from: string, to: string, text: string) => {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "message", from, to, text }));
  } else {
    console.warn("⚠️ WebSocket not ready");
  }
};

export const markMessageAsRead = (from: string, to: string) => {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "read", from, to }));
  } else {
    console.warn("⚠️ WebSocket not ready");
  }
};
