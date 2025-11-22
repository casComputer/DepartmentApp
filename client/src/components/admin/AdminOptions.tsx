import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { router } from "expo-router";

const ICONS_SIZE = 40;

const AdminOptions = () => {
    return (
        <View className="px-3 mt-12 flex-1 gap-3">
            <TouchableOpacity
                onPress={() => router.push("/(admin)/(others)/ManageTeachers")}
                className="flex-row items-center gap-4 px-6 py-7 border-b border-gray-200 bg-white w-full rounded-3xl overflow-hidden"
                style={{ elevation: 3 }}>
                <MaterialCommunityIcons
                    name="account-group-outline"
                    size={ICONS_SIZE}
                    color="#4B5563"
                />
                <Text className="font-bold text-xl text-gray-700 ">
                    Manage Teachers
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push("/(admin)/(others)/ManageClasses")}
                className="flex-row items-center gap-4 px-6 py-7 border-b border-gray-200 bg-white w-full rounded-3xl overflow-hidden"
                style={{ elevation: 3 }}>
                <MaterialCommunityIcons
                    name="account-group-outline"
                    size={ICONS_SIZE}
                    color="#4B5563"
                />
                <Text className="font-bold text-xl text-gray-700 ">
                    Manage Classes
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default AdminOptions;
