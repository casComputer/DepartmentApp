import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@icons";

import { useAppStore } from '@store/app.store.js'

// implement message enquiry feature later

const Waiting = () => {
    const removeUser =
        useAppStore(state => state?.removeUser)
    
    const logout = ()=>{
        removeUser()
    }
    
    return (
        <View className="flex-1 bg-primary justify-center items-center gap-2">
            <TouchableOpacity onPress={logout} className="absolute top-15 right-3">
                <Text className="text-2xl font-black text-red-500">Log out</Text>
            </TouchableOpacity>
            <Ionicons name="time-outline" size={90} style={{ marginTop: -50, }}/>
            <Text className="text-3xl font-black text-text-secondary">
                Waiting For Confirmation
            </Text>
            <Text className="text-sm font-bold text-text">
                You can continue once your verification is approved.
            </Text>
        </View>
    );
};

export default Waiting;
