import { View, Text } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

const Header = () => {
  return (
    <View className="flex-row items-center justify-between px-6">
      <Text className="text-5xl font-black">DC-Connect</Text>
      <View className="flex-row items-center gap-4">
        <Ionicons name="notifications" size={24} color="black" />
        <Feather name="settings" size={24} color="black" />
      </View>
    </View>
  );
};

export default Header;
