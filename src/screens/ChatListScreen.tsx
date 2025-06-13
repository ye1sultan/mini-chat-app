import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../../App";
import MemoCheck from "../assets/svg/check";
import MemoDoubleCheck from "../assets/svg/double-check";
import { defaultUsers } from "../data/consts";
import { useAuthStore } from "../stores/useAuthStore";
import { useMessageStore } from "../stores/useMessageStore";

type ChatListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Chat List">;
};

export default function ChatListScreen({ navigation }: ChatListScreenProps) {
  const currentUser = useAuthStore((state) => state.user);
  const messagesByUser = useMessageStore((state) => state.messagesByUser);

  function handleChatPress(recipientName: string, avatar: string) {
    navigation.navigate("Chat", {
      me: currentUser?.name || "",
      recipient: recipientName,
      avatar,
    });
  }

  const chatList = useMemo(() => {
    if (!currentUser) return [];

    return defaultUsers
      .filter((user) => user.name !== currentUser.name)
      .map((user) => {
        const key = [user.name, currentUser.name].sort().join("_");
        const messages = messagesByUser[key] || [];

        const lastMessage = messages[messages.length - 1];

        return {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          lastMessage: lastMessage?.text || "No messages yet",
          time: lastMessage
            ? new Date(lastMessage.timestamp || Date.now()).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
            : "",
          lastMessageFromMe: lastMessage?.from === currentUser.name,
          read: lastMessage?.read ?? true,
          unreadCount: messages.filter((msg) => !msg.read).length,
        };
      });
  }, [currentUser, messagesByUser]);

  return (
    <View className="flex-1 bg-neutral-900">
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleChatPress(item.name, item.avatar)}
            className="flex-row items-center gap-4 p-4 active:opacity-70"
          >
            <View>
              <Image
                source={{ uri: item.avatar }}
                className="w-12 h-12 rounded-full"
              />
            </View>

            <View className="flex-1">
              <View className="flex-row items-center gap-1 mb-1">
                <Text className="text-lg font-semibold text-neutral-200 flex-1">
                  {item.name}
                </Text>
                {item.lastMessageFromMe &&
                  (item.read ? (
                    <MemoDoubleCheck
                      className="text-blue-500"
                      width={20}
                      height={20}
                    />
                  ) : (
                    <MemoCheck
                      className="text-neutral-500"
                      width={20}
                      height={20}
                    />
                  ))}
                {!item.lastMessageFromMe && !item.read && (
                  <View className="bg-blue-500 w-6 h-6 rounded-full items-center justify-center">
                    <Text className="text-xs text-white font-medium">
                      {item.unreadCount}
                    </Text>
                  </View>
                )}
              </View>
              <View className="flex-row items-center gap-1">
                <Text
                  numberOfLines={1}
                  className="text-sm text-neutral-400 flex-1"
                >
                  {item.lastMessage}
                </Text>
                {item.time && (
                  <Text className="text-xs text-neutral-400">{item.time}</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
