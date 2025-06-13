import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, StatusBar, View } from "react-native";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatDetailScreen from "./src/screens/ChatDetailScreen";
import ChatListScreen from "./src/screens/ChatListScreen";
import LoginScreen from "./src/screens/LoginScreen";

export type RootStackParamList = {
  Login: undefined;
  "Chat List": undefined;
  Chat: {
    me: string;
    recipient: string;
    avatar: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#171717" />
        <View className="flex-1">
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerStyle: {
                backgroundColor: "#171717",
              },
              headerTitleStyle: {
                color: "#ffffff",
                fontSize: 18,
                fontWeight: "bold",
              },
              headerTintColor: "#ffffff",
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Chat List" component={ChatListScreen} />
            <Stack.Screen
              name="Chat"
              component={ChatDetailScreen}
              options={({ route }) => ({
                title: route.params.recipient,
                headerRight: () => (
                  <Image
                    source={{ uri: route.params.avatar }}
                    className="w-8 h-8 rounded-full"
                  />
                ),
              })}
            />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
