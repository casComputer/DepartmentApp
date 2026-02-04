import "../../global.css";
import React from "react";
import { Stack, router, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, useColorScheme } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { KeyboardProvider } from "react-native-keyboard-controller";
import * as Notifications from "expo-notifications";

import queryClient from "@utils/queryClient";
import { useAppStore } from "@store/app.store.js";
import { getUser } from "@storage/user.storage.js";
import { Uniwind } from "uniwind";

import GlobalProgress from "@components/common/GlobalProgress.jsx";

Uniwind.setTheme("system");
useAppStore.getState().hydrateUser(getUser());

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false
    })
});

const Layout = ({ userId, role }) => (
    <Stack
        screenOptions={{
            headerShown: false,
            animation: "slide_from_right"
        }}
    >
        <Stack.Protected guard={!userId || role === "unknown" || !role}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth/Signin" />
            <Stack.Screen name="auth/Signup" />
        </Stack.Protected>

        <Stack.Protected guard={userId !== "" && role === "student"}>
            <Stack.Screen name="(student)/(tabs)" />
            <Stack.Screen name="(student)/(others)" />
        </Stack.Protected>
        <Stack.Protected guard={userId !== "" && role === "admin"}>
            <Stack.Screen name="(admin)/(tabs)" />
        </Stack.Protected>

        <Stack.Protected guard={userId !== "" && role === "teacher"}>
            <Stack.Screen name="(teacher)/(tabs)" />
            <Stack.Screen name="(teacher)/(others)" />
        </Stack.Protected>

        <Stack.Protected guard={userId !== "" && role === "parent"}>
            <Stack.Screen name="(parent)/(tabs)" />
        </Stack.Protected>
    </Stack>
);

export default function RootLayout() {
    const theme = useColorScheme();

    const { userId, role } = useAppStore(state => state?.user) ?? {};

    useEffect(() => {
        registerForPushNotifications().then(token => {
            if (token) {
                console.log("Expo token:", token);
            }
        });
    }, []);

    return (
        <View className="${theme === 'dark' ? 'dark': ''} flex-1 bg-primary">
            <StatusBar style="auto" animated />
            <KeyboardProvider>
                <QueryClientProvider client={queryClient}>
                    <Layout userId={userId} role={role} />
                </QueryClientProvider>
            </KeyboardProvider>
            <GlobalProgress />
        </View>
    );
}
