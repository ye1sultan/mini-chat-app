import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../../App";
import { defaultUsers } from "../data/consts";
import { useAuthStore } from "../stores/useAuthStore";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const login = useAuthStore((state) => state.login);

  function handleLogin(user: any) {
    login(user);
    navigation.replace("Chat List");
  }

  return (
    <View className="flex-1 justify-center items-center bg-neutral-900 px-6">
      <Text className="text-white text-2xl mb-8">Login as:</Text>

      {defaultUsers.map((user) => (
        <TouchableOpacity
          key={user.id}
          onPress={() => handleLogin(user)}
          className="flex-row items-center bg-neutral-800 p-4 rounded-lg w-full mb-4"
        >
          <Image
            source={{ uri: user.avatar }}
            className="w-12 h-12 rounded-full mr-4"
          />
          <Text className="text-white text-lg">{user.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
