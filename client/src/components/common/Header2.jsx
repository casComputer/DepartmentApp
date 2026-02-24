import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
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
        <View className="flex-row items-center justify-between pl-2 pr-3">
            <TouchableOpacity
                className="flex-row items-center gap-0"
                onPress={handleBack}
            >
                <MaterialIcons
                    name="arrow-back-ios-new"
                    size={RFValue(23)}
                    color="rgb(59, 130, 246)"
                />
                <Text
                    style={{ fontSize: RFPercentage(3.5) }}
                    className="text-blue-500 font-semibold"
                >
                    Back
                </Text>
            </TouchableOpacity>
            {typeof onSave === "function" && (
                <TouchableOpacity
                    disabled={saving || disabled}
                    onPress={handleSave}
                >
                    <Text
                        style={{ fontSize: RFPercentage(3.5) }}
                        className="text-blue-500 font-semibold"
                    >
                        {saving ? "Saving..." : "Save"}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};
export default Header;
