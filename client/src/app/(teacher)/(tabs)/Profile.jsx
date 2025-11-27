import { View, Text } from "react-native";
import React from "react";

import { useAppStore } from "@store/app.store.js";

const Profile = () => {
    const username = useAppStore(state => state.user?.userId || "");

    return (
        <View className="flex-1 justify-center items-center bg-blue-700">
            <Text>{username}</Text>
        </View>
    );
};

export default Profile;
