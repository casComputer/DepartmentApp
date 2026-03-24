import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

const Header = ({ onSave, saving, disabled }) => {
    const handleSave = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSave();
    };
    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    };

    return (
        <View className="flex-row items-center justify-between px-2">
            <TouchableOpacity
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                className="flex-row items-center gap-1 overflow-hidden"
                onPress={handleBack}>
                <MaterialIcons
                    name="arrow-back-ios-new"
                    size={22}
                    color="rgb(59, 130, 246)"
                />
                <Text className="text-blue-500 font-bold text-3xl">Back</Text>
            </TouchableOpacity>
            {typeof onSave === "function" && (
                <TouchableOpacity
                    disabled={saving || disabled}
                    onPress={handleSave}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    className="overflow-hidden">
                    <Text className="text-blue-500 font-bold text-3xl">
                        {saving ? "Saving..." : "Save"}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Header;
