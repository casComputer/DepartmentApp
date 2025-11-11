import "../../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, useColorScheme } from "react-native";

import { useAppStore } from "../store/app.store";

export default function RootLayout() {
  const theme = useColorScheme();
  // let user = useAppStore((state) => state.user);
  let user = {
    userId: "123456",
    role: "admin",
  }

  console.log("Current User:", user);

  return (
    <View className="${theme === 'dark' ? 'dark': ''} flex-1 ${theme== 'dark' ? 'bg-black' : 'bg-white' }">
      <StatusBar style="auto" animated />

      <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
        <Stack.Protected guard={!user?.userId}>
          <Stack.Screen
            name="index"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="auth/Signin"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="auth/Signup"
            options={{ animation: "slide_from_right" }}
          />
        </Stack.Protected>

        <Stack.Protected guard={user.userId != "" && user.role === "student"}>
          <Stack.Screen name="(student)" />
        </Stack.Protected>
        <Stack.Protected guard={user.userId != "" && user.role === "admin"}>
          <Stack.Screen name="(admin)/(tabs)" />
        </Stack.Protected>

      </Stack>
    </View>
  );
}
