import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "../../global.css";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar style="auto" animated />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/Signin" />
        <Stack.Screen name="auth/Signup" />
      </Stack>
    </View>
  );
}
