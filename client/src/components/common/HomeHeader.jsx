import { View, Text } from "react-native";
import { Feather, Ionicons } from "@icons";
import { withUniwind } from "uniwind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header = () => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{ paddingTop: insets.top + 20 }}
            className="flex-row items-center justify-between px-6">
            <Text className="text-5xl font-black dark:text-white">
                DC-Connect
            </Text>
            <View className="flex-row items-center gap-4 text-white">
                <Ionicons
                    name="notifications"
                    size={24}
                />
                <Feather
                    name="settings"
                    size={24}
                />
            </View>
        </View>
    );
};

export default Header;
