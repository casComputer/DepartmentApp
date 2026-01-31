import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, Octicons } from "@icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ICON_SIZE = 24;

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
      <View className="flex-row gap-5 justify-center items-center">
        <TouchableOpacity
          onPress={() => router.push("/common/profile/EditProfile")}
        >
          <Octicons name="person" size={ICON_SIZE} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/common/settings/Settings")}
        >
          <Feather name="settings" size={ICON_SIZE} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
