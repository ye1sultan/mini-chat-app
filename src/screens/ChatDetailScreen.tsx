import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MemoCheck from "../assets/svg/check";
import MemoChevronRight from "../assets/svg/chevron-right";
import MemoDoubleCheck from "../assets/svg/double-check";
import { markMessageAsRead, sendMessage } from "../hooks/useWebSocket";
import { useMessageStore } from "../stores/useMessageStore";

export default function ChatDetailScreen({ route }: { route: any }) {
  const { me, recipient } = route.params;
  const [message, setMessage] = useState("");

  const key = useMemo(() => [me, recipient].sort().join("_"), [me, recipient]);

  const allMessages = useMessageStore((state) => state.messagesByUser);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    setMessages(allMessages[key] || []);
  }, [allMessages, key]);

  useEffect(() => {
    messages.forEach((msg) => {
      if (!msg.read && msg.from === recipient) {
        markMessageAsRead(recipient, me);
      }
    });
  }, [messages, me, recipient]);

  const flatListRef = useRef<FlatList>(null);

  const onSend = () => {
    if (!message.trim()) return;
    useMessageStore.getState().addMessage(me, recipient, message);
    sendMessage(me, recipient, message);
    setMessage("");
  };

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
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
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                className={`p-2 m-2 rounded-lg max-w-md ${
                  item.from === me
                    ? "self-end bg-blue-500"
                    : "self-start bg-neutral-200"
                }`}
              >
                <Text
                  className={
                    item.from === me ? "text-neutral-50" : "text-neutral-950"
                  }
                >
                  {item.text}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs text-gray-400 text-right">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  {item.from === me &&
                    (item.read ? (
                      <MemoDoubleCheck
                        width={16}
                        height={16}
                        className="text-blue-300"
                      />
                    ) : (
                      <MemoCheck
                        width={16}
                        height={16}
                        className="text-blue-300"
                      />
                    ))}
                </View>
              </View>
            )}
          />
        )}
        <View className="flex-row items-center p-4 border-t border-neutral-800 pb-6">
          <TextInput
            className="flex-1 border border-neutral-600 rounded-full px-4 h-10 mr-2 text-neutral-50"
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            keyboardAppearance="dark"
            autoCapitalize="none"
            autoCorrect={false}
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
