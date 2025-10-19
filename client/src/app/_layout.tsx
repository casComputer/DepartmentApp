import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, useColorScheme } from "react-native";
import "../../global.css";

export default function RootLayout() {
    const theme = useColorScheme();

    return (
        <View className="${theme === 'dark' ? 'dark': ''} flex-1 ${theme== 'dark' ? 'bg-black' : 'bg-white' }">
            <StatusBar style="auto" animated />

            <Stack screenOptions={{ headerShown: false }}>
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
            </Stack>
        </View>
    );
}
