import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ICON_SIZE = 22;

const Header = ({ title }) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{ marginTop: insets.top }}
            className="flex-row items-center px-1 w-full justify-between"
        >
            <Text
                className="text-[8vw] font-bold text-text max-w-[75%]"
                numberOfLines={2}
                adjustsFontSizeToFit
            >
                {title}
            </Text>

            <TouchableOpacity onPress={()=> router.push('/common/settings/Settings')}>
                <Feather name="settings" size={ICON_SIZE} />
            </TouchableOpacity>
        </View>
    );
};

export default Header;
