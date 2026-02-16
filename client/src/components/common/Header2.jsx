import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header = ({ onSave, saving, disabled }) => {
    const insets = useSafeAreaInsets();
    return (
        <View
            // style={{ marginTop: insets.top }}
            className="flex-row items-center justify-between pl-2 pr-3"
        >
            <TouchableOpacity
                className="flex-row items-center gap-0"
                onPress={() => router.back()}
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
            
            {typeof onSave === 'function' && (

                <TouchableOpacity
                    disabled={saving || disabled}
                    onPress={onSave}
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
