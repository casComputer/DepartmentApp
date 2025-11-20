import "../../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, useColorScheme } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";

import queryClient from "@utils/queryClient";
import { useAppStore } from "../store/app.store";

export default function RootLayout() {
  const theme = useColorScheme();
  // let user = useAppStore((state) => state.user);
  let user = { userId: "12345", role: "teacher" };


  console.log("Current User:", user);

  return (
    <View className="${theme === 'dark' ? 'dark': ''} flex-1 ${theme== 'dark' ? 'bg-black' : 'bg-white' }">
      <StatusBar style="auto" animated />
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        >
          <Stack.Protected guard={!user?.userId}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth/Signin" />
            <Stack.Screen name="auth/Signup" />
          </Stack.Protected>

          <Stack.Protected
            guard={user?.userId !== "" && user?.role === "student"}
          >
            <Stack.Screen name="(student)" />
          </Stack.Protected>
          <Stack.Protected guard={user?.userId !== "" && user?.role === "admin"}>
            <Stack.Screen name="(admin)/(tabs)" />
          </Stack.Protected>
          <Stack.Protected guard={user?.userId !== "" && user?.role === "teacher"}>
            <Stack.Screen name="(teacher)/(tabs)" />
          </Stack.Protected>
        </Stack>
      </QueryClientProvider>
    </View>
  );
}
