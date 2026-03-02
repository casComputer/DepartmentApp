import "../../global.css";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, useColorScheme } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { KeyboardProvider } from "react-native-keyboard-controller";
import * as Notifications from "expo-notifications";
import { Uniwind } from "uniwind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import queryClient from "@utils/queryClient";
import { useAppStore } from "@store/app.store.js";
import { getUser } from "@storage/user.storage.js";
import { storage } from "@utils/storage.js";

import { registerForPushNotificationsAsync } from "@controller/common/notification.controller.js";
import syncUser from "@controller/common/sync.controller.js";

import GlobalProgress from "@components/common/GlobalProgress.jsx";

useAppStore.getState().hydrateUser(getUser());

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true
    })
});

const Layout = ({ userId, role, is_verified, is_email_verified }) => (
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

        {/* <Stack.Protected guard={!is_email_verified && userId}>
            <Stack.Screen name="EmailVerification" />
        </Stack.Protected> */}

        <Stack.Protected guard={is_verified}>
            <Stack.Protected guard={userId !== "" && role === "student"}>
                <Stack.Screen name="(student)/(tabs)" />
                <Stack.Screen name="(student)/(others)" />
            </Stack.Protected>
            <Stack.Protected guard={userId !== "" && role === "admin"}>
                <Stack.Screen name="(admin)/(tabs)" />
            </Stack.Protected>

            <Stack.Protected
                guard={
                    userId !== "" && (role === "teacher" || role === "admin")
                }
            >
                <Stack.Screen name="(teacher)/(tabs)" />
                <Stack.Screen name="(teacher)/(others)" />
            </Stack.Protected>

            <Stack.Protected guard={userId !== "" && role === "parent"}>
                <Stack.Screen name="(parent)/(tabs)" />
            </Stack.Protected>
        </Stack.Protected>

        <Stack.Protected guard={!is_verified && userId}>
            <Stack.Screen name="Waiting" />
        </Stack.Protected>
        <Stack.Screen
            name="common/ImageFullView"
            options={{
                animation: "fade"
            }}
        />
    </Stack>
);

export default function RootLayout() {
    const theme = useColorScheme();
    const insets = useSafeAreaInsets();

    const currTheme = storage.getString("theme");
    
    useEffect(() => {
        Uniwind.setTheme(currTheme ?? "system");
    }, [currTheme]);

    const { userId, role, is_verified, is_email_verified } =
        useAppStore(state => state?.user) ?? {};

    useEffect(() => {
        if (!userId || !role) return;
        registerForPushNotificationsAsync();
        syncUser(role);
    }, [userId, role]);

    return (
        <View
            style={{ paddingTop: insets.top }}
            className="${theme === 'dark' ? 'dark': ''} flex-1 bg-primary"
        >
            <StatusBar
                style={`${currTheme === "system" || currTheme === "light" ? "auto" : "light"}`}
                animated
            />
            <KeyboardProvider>
                <QueryClientProvider client={queryClient}>
                    <Layout
                        userId={userId}
                        role={role}
                        is_verified={is_verified}
                        is_email_verified={is_email_verified}
                    />
                </QueryClientProvider>
            </KeyboardProvider>
            <GlobalProgress />
        </View>
    );
}
