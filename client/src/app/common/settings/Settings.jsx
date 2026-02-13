import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import Header from "@components/common/Header.jsx";

import { useAppStore } from "@store/app.store.js";

const removeUser = useAppStore.getState().removeUser;

const Settings = () => {
    return (
        <View className="flex-1 bg-primary">
            <Header title={"Settings"} />
            <TouchableOpacity
                onPress={() => router.push("/common/theme/ThemeSwitcher")}
                className="mt-1 py-6 px-5 bg-card rounded-2xl"
            >
                <Text className="text-text text-xl font-bold">Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => removeUser()}
                className="mt-1 py-6 px-5  bg-card rounded-2xl"
            >
                <Text className="text-red-500 text-xl font-bold">Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Settings;
