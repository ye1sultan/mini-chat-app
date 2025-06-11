import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MemoChevronRight from "../assets/svg/chevron-right";
import { useWebSocket } from "../hooks/useWebSocket";
import { useChatStore } from "../stores/useChatStore";

export default function ChatDetailScreen({ route }: { route: any }) {
  const { chatId, myUserId } = route.params;

  const rawMessages = useChatStore((s) => s.chats[chatId]);
  const messages = rawMessages || [];

  const { sendMessage, socket } = useWebSocket(myUserId);

  const [message, setMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  function onSend() {
    if (!message.trim()) return;

    const msg = {
      id: Date.now().toString(),
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    sendMessage(chatId, msg);
    setMessage("");
  }

  useEffect(() => {
    const unreadMessages = messages.filter(
      (msg) => msg.sender === "them" && !msg.read
    );

    unreadMessages.forEach((msg) => {
      socket?.send(JSON.stringify({ type: "read", chatId, messageId: msg.id }));
    });

    console.log("unreadMessages", unreadMessages);
  }, [chatId]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: false });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      className="flex-1 bg-neutral-900"
    >
      <View className="flex-1 bg-neutral-900">
        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-neutral-400">No messages yet</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                className={`p-2 m-2 rounded-lg max-w-md ${
                  item.sender === "me"
                    ? "self-end bg-blue-500"
                    : "self-start bg-neutral-200"
                }`}
              >
                <Text
                  className={
                    item.sender === "me"
                      ? "text-neutral-50"
                      : "text-neutral-950"
                  }
                >
                  {item.text}
                </Text>
                <Text className="text-xs text-gray-400 text-right">
                  {`${item.time.split(":")[0]}:${item.time.split(":")[1]}`}
                </Text>
              </View>
            )}
          />
        )}
        <View className="flex-row p-4 border-t border-neutral-700 bg-neutral-900 pb-6">
          <TextInput
            className="flex-1 border border-neutral-600 rounded-full px-4 h-10 mr-2 text-neutral-50"
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            keyboardAppearance="dark"
          />
          <TouchableOpacity
            className="bg-blue-500 h-10 w-10 rounded-full items-center justify-center"
            onPress={onSend}
          >
            <MemoChevronRight
              width={20}
              height={20}
              strokeWidth={2}
              className="text-neutral-50"
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
