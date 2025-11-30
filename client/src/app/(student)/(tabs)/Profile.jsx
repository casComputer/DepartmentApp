import { View, Text, Button } from "react-native";
import React from "react";

import { useAppStore } from "@store/app.store.js";

const removeUser = useAppStore.getState().removeUser;

const Profile = () => {
    return (
        <View className="flex-1 justify-center items-center bg-blue-700">
            <Button onPress={() => removeUser()} title="logout" />
        </View>
    );
};

export default Profile;
