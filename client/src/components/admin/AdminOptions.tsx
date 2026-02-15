import { View, Text, TouchableOpacity } from "react-native";
import {
    MaterialCommunityIcons,
    Octicons,
    SimpleLineIcons,
    MaterialIcons,
    FontAwesome5
} from "@icons";

import { router } from "expo-router";

const ICONS_SIZE = 35;

const AdminOptions = () => {
    return (
        <View className="px-3 mt-12 flex-1 gap-2 -mb-6">
            <TouchableOpacity
                onPress={() => router.push("/(admin)/(others)/ManageTeachers")}
                className="flex-row items-center gap-4 px-6 py-6 rounded-2xl bg-card"
                style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
            >
                <MaterialCommunityIcons
                    name="account-group-outline"
                    size={ICONS_SIZE}
                />
                <Text className="font-bold text-xl text-gray-700 text-text ">
                    Manage Teachers
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push("/(admin)/(others)/WorkLogHistory")}
                className="flex-row items-center gap-4 px-6 py-7 rounded-3xl bg-card"
                style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
            >
                <Octicons name="log" size={ICONS_SIZE} />
                <Text className="font-bold text-xl text-gray-700 text-text ">
                    View Work Logs
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push("/common/fees/Selector" as any)}
                className="bg-card px-6 py-7 rounded-3xl flex-row items-center gap-4 "
            >
                <MaterialIcons name="currency-rupee" size={ICONS_SIZE} />
                <Text className="font-bold text-xl text-gray-700 text-text ">
                    Manage Fees
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default AdminOptions;
