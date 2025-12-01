import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ICON_SIZE = 26;

const Header = ({
    title,
    extraButton = false,
    handlePress,
    buttonTitle = ""
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{ marginTop: insets.top }}
            className="flex-row items-center px-2 w-full justify-between">
            <View className="flex-row justify-center items-center gap-0">
                <TouchableOpacity className="p-1" onPress={() => router.back()}>
                    <MaterialIcons
                        name="arrow-back-ios-new"
                        size={ICON_SIZE}
                        style={{ fontWeight: "bold" }}
                    />
                </TouchableOpacity>
                <Text className="text-[10vw] font-bold dark:text-white">{title}</Text>
            </View>
            {extraButton && (
                <TouchableOpacity onPress={handlePress}>
                    <Text className="text-3xl text-blue-500 font-bold">
                        {buttonTitle}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Header;
