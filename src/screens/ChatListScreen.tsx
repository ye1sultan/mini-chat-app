import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../../App";
import MemoCheck from "../assets/svg/check";
import MemoDoubleCheck from "../assets/svg/double-check";
import { defaultUsers } from "../data/consts";
import { useChatStore } from "../stores/useChatStore";

type ChatListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Chat List">;
};

export default function ChatListScreen({ navigation }: ChatListScreenProps) {
  const chats = useChatStore((state) => state.chats);

  function handleChatPress(chatId: string, name: string, avatar: string) {
    const myUserId = chatId === "1" ? "2" : "1";

    navigation.navigate("Chat", {
      chatId,
      myUserId,
      name,
      avatar,
    });
  }

  const chatList = defaultUsers.map((user) => {
    const messages = chats[user.id] || [];
    const lastMessage = messages[messages.length - 1];
    const isFromMe = lastMessage?.sender === "me";

    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      time: lastMessage?.time || "",
      lastMessage: lastMessage?.text,
      lastMessageFromMe: isFromMe,
      read: true,
    };
  });

  return (
    <View className="flex-1 bg-neutral-900">
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleChatPress(item.id, item.name, item.avatar)}
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
              </View>
              <View className="flex-row items-center gap-1">
                <Text
                  numberOfLines={1}
                  className="text-sm text-neutral-400 flex-1"
                >
                  {item.lastMessage || "No messages yet"}
                </Text>
                {item.time && (
                  <Text className="text-xs text-neutral-400">
                    {`${item.time.split(":")[0]}:${item.time.split(":")[1]}`}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
