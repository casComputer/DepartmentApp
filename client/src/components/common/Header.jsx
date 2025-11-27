import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const ICON_SIZE = 26,
    ICON_COLOR = "black";

const Header = ({ title }) => {
    return (

        <View className="flex-row items-center px-2 self-start">
            <TouchableOpacity className="p-1" onPress={() => router.back()}>
                <MaterialIcons
                    name="arrow-back-ios-new"
                    size={ICON_SIZE}
                    color={ICON_COLOR}
                    style={{ fontWeight: "bold" }}
                />
            </TouchableOpacity>
            <Text className="text-[10vw] font-bold">{title}</Text>
        </View>
    );
};

export default Header;
