import "../../global.css";
import React from "react";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, useColorScheme } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";

import queryClient from "@utils/queryClient";
import { useAppStore } from "../store/app.store";

export default function RootLayout() {
    const theme = useColorScheme();
    const [mounted, setMounted] = React.useState(false);
    let userId = useAppStore(state => state.user.userId);
    let role = useAppStore(state => state.user.role);

    // let userId = "",
    // role = "unknown";

    React.useEffect(() => {
        if (!mounted) return;
        console.log(!userId || !role || role == "unknown");
        if (!userId || !role || role == "unknown")
            router.replace("Auth/SignIn");
        setMounted(true);
    }, [userId, role]);

    console.log("Current User:", userId, role);

    return (
        <View className="${theme === 'dark' ? 'dark': ''} flex-1 ${theme== 'dark' ? 'bg-black' : 'bg-white' }">
            <StatusBar style="auto" animated />
            <QueryClientProvider client={queryClient}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        animation: "slide_from_right"
                    }}>
                    <Stack.Protected guard={!userId || role === "unknown"}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="auth/Signin" />
                        <Stack.Screen name="auth/Signup" />
                    </Stack.Protected>

                    <Stack.Protected
                        guard={userId !== "" && role === "student"}>
                        <Stack.Screen name="(student)" />
                    </Stack.Protected>
                    <Stack.Protected guard={userId !== "" && role === "admin"}>
                        <Stack.Screen name="(admin)/(tabs)" />
                    </Stack.Protected>
                    <Stack.Protected
                        guard={userId !== "" && role === "teacher"}>
                        <Stack.Screen name="(teacher)/(tabs)" />
                    </Stack.Protected>
                </Stack>
            </QueryClientProvider>
        </View>
    );
}
