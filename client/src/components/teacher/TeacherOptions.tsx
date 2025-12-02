import { FontAwesome5, MaterialCommunityIcons, Octicons } from "@icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const ICONS_SIZE = 40;

const TeacherOptions = () => {
    return (
        <View className="px-2 mt-12 flex-1 gap-3">
            {/* First Row of Options */}

            <TouchableOpacity
                style={{ boxShadow: "0px 1px 5px rgba(0,0,0,0.5)" }}
                onPress={() =>
                    router.push("/(teacher)/(others)/ManageStudents")
                }
                className="bg-white px-6 py-7 rounded-3xl flex-row items-center gap-4 dark:bg-zinc-900">
                <MaterialCommunityIcons
                    name="account-group-outline"
                    size={ICONS_SIZE}
                />
                <Text className="font-bold text-xl text-gray-700 dark:text-white">
                    Manage Students
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ boxShadow: "0px 1px 5px rgba(0,0,0,0.5)" }}
                onPress={() =>
                    router.push(
                        "/(teacher)/(others)/AttendanceClassSelect" as any
                    )
                }
                className="bg-white px-6 py-7 rounded-3xl flex-row items-center gap-4 dark:bg-zinc-900">
                <FontAwesome5 name="clipboard-list" size={ICONS_SIZE} />
                <Text className="font-bold text-xl text-gray-700 dark:text-white ">
                    Attendance
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ boxShadow: "0px 1px 5px rgba(0,0,0,0.5)" }}
                onPress={() =>
                    router.push("/(teacher)/(others)/WorkLogSelection" as any)
                }
                className="bg-white px-6 py-7 rounded-3xl flex-row items-center gap-4 dark:bg-zinc-900">
                <Octicons name="log" size={ICONS_SIZE} />
                <Text className="font-bold text-xl text-gray-700 dark:text-white ">
                    Work Log
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default TeacherOptions;
