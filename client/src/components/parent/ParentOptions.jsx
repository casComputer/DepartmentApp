import { View, Text, TouchableOpacity } from "react-native"
import { router } from "expo-router"
import { MaterialCommunityIcons } from "@icons"

const ICONS_SIZE = 30;

const ParentOptions = () => {
  return (
    <View className="px-2 mt-12 flex-1 gap-3">
    
      <TouchableOpacity
        className="bg-card px-6 py-7 rounded-3xl flex-row items-center gap-4 "
      >
        <MaterialCommunityIcons
          name="account-group-outline"
          size={ICONS_SIZE}
        />
        <Text className="font-bold text-xl text-text">...</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ParentOptions;
