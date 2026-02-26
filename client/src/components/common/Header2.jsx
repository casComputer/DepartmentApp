import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";

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
                className="flex-row items-center gap-1 overflow-hidden px-3"
                style={styles.background}
                onPress={handleBack}
            >
                <BlurView
                    tint="dark"
                    intensity={10}
                    experimentalBlurMethod={"dimezisBlurView"}
                    style={[StyleSheet.absoluteFillObject]}
                />
                <MaterialIcons
                    name="arrow-back-ios-new"
                    size={22}
                    color="rgb(59, 130, 246)"
                />
                <Text className="text-blue-500 font-bold text-2xl">Back</Text>
            </TouchableOpacity>
            {typeof onSave === "function" && (
                <TouchableOpacity
                    disabled={saving || disabled}
                    onPress={handleSave}
                    className="overflow-hidden px-3"
                    style={styles.background}
                >
                    <BlurView
                        tint="dark"
                        intensity={10}
                        experimentalBlurMethod={"dimezisBlurView"}
                        style={[StyleSheet.absoluteFillObject]}
                    />
                    <Text className="text-blue-500 font-bold text-2xl">
                        {saving ? "Saving..." : "Save"}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        backgroundColor: "rgba(0,0,0,0.211)",
        borderColor: "#323232",
        borderWidth: 1,
        borderRadius: 23,
        padding: 10
    }
});

export default Header;
