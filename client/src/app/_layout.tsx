import "../../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, useColorScheme } from "react-native";

import { useAppStore  } from "../store/app.store";

export default function RootLayout() {
  const theme = useColorScheme();
  const user = useAppStore(state=> state.user);



  console.log("Current User:", user);

  return (
    <View className="${theme === 'dark' ? 'dark': ''} flex-1 ${theme== 'dark' ? 'bg-black' : 'bg-white' }">
      <StatusBar style="auto" animated />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={user.userId == null}>
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
        <Stack.Protected guard={user.userId != null}>
          <Stack.Screen name="(secure)" />
        </Stack.Protected>
      </Stack>
    </View>
  );
}
