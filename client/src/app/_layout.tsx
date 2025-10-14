
import { Stack, } from "expo-router";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <View style={{ flex: 1 , backgroundColor: "black"}}>
      <StatusBar style="auto" animated />

      <Stack screenOptions={{ headerShown: false }} />
    </View>
  )
}
