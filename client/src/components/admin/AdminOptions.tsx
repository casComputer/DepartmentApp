import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, Octicons } from "@icons";

import { router } from "expo-router";

const ICONS_SIZE = 40;

const AdminOptions = () => {
    return (
        <View className="px-3 mt-12 flex-1 gap-3">
            <TouchableOpacity
                onPress={() => router.push("/(admin)/(others)/ManageTeachers")}
                className="flex-row items-center gap-4 px-6 py-7 bg-white rounded-3xl dark:bg-zinc-900"
                style={{ boxShadow: "0px 1px 3px (0,0,0,0.5)" }}>
                <MaterialCommunityIcons
                    name="account-group-outline"
                    size={ICONS_SIZE}
                />
                <Text className="font-bold text-xl text-gray-700 dark:text-white ">
                    Manage Teachers
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push("/(admin)/(others)/WorkLogHistory")}
                className="flex-row items-center gap-4 px-6 py-7 bg-white rounded-3xl dark:bg-zinc-900"
                style={{ boxShadow: "0px 1px 3px (0,0,0,0.5)" }}>
                <Octicons name="log" size={ICONS_SIZE} />
                <Text className="font-bold text-xl text-gray-700 dark:text-white ">
                    Work Log
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.push("/(admin)/(others)/WorkLogHistory")}
                className="flex-row items-center gap-4 px-6 py-7 bg-white rounded-3xl dark:bg-zinc-900"
                style={{ boxShadow: "0px 1px 3px (0,0,0,0.5)" }}>
                <Octicons name="log" size={ICONS_SIZE} />
                <Text className="font-bold text-xl text-gray-700 dark:text-white ">
                    cls
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default AdminOptions;
