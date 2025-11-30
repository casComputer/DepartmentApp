import { View, Text,useColorScheme } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

const Header = () => {
    const theme = useColorScheme();
    
    return (
        <View className="flex-row items-center justify-between px-6">
            <Text className="text-5xl font-black dark:text-white">
                DC-Connect
            </Text>
            <View className="flex-row items-center gap-4 text-white">
                <Ionicons name="notifications" size={24} color={theme === 'dark' ? 'white' : 'black'} />
                <Feather name="settings" size={24} color={theme === 'dark' ? 'white' : 'black'} />
            </View>
        </View>
    );
};

export default Header;
