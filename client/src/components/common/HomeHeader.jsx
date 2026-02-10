import { View, Text , TouchableOpacity} from "react-native";
import { Ionicons } from "@icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from 'expo-router'

const Header = () => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{ paddingTop: insets.top + 20 }}
            className="flex-row items-center justify-between px-4"
        >
            <Text className="text-5xl font-black text-text-secondary">
                DC-Connect
            </Text>
            <TouchableOpacity onPress={()=> router.push('/common/notification/NotificationList')} className="flex-row items-center gap-4 text-white">
                <Ionicons name="notifications" size={24} />
            </TouchableOpacity>
        </View>
    );
};

export default Header;
