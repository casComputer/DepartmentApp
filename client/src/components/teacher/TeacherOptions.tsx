import {
    FontAwesome5,
    MaterialCommunityIcons,
    Octicons,
    SimpleLineIcons,
    MaterialIcons
} from "@icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { useAppStore } from "@store/app.store.js";

const ICONS_SIZE = 35;

const TeacherOptions = () => {
    return (
        <View className="px-2 mt-12 flex-1 gap-3">
            {/* First Row of Options */}

            <TouchableOpacity
                style={{}}
                onPress={() =>
                    router.push("/(teacher)/(others)/ManageStudents")
                }
                className="bg-card px-6 py-7 rounded-3xl flex-row items-center gap-4 "
            >
                <MaterialCommunityIcons
                    name="account-group-outline"
                    size={ICONS_SIZE}
                />
                <Text className="font-bold text-xl text-text">
                    Manage Students
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() =>
                    router.push(
                        "/common/attendance/AttendanceClassSelect" as any
                    )
                }
                className="bg-card px-6 py-7 rounded-3xl flex-row items-center gap-4"
            >
                <FontAwesome5 name="clipboard-list" size={ICONS_SIZE} />
                <Text className="font-bold text-xl text-text ">Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() =>
                    router.push("/(teacher)/(others)/WorkLogSelection" as any)
                }
                className="bg-card px-6 py-7 rounded-3xl flex-row items-center gap-4 "
            >
                <Octicons name="log" size={ICONS_SIZE} />
                <Text className="font-bold text-xl text-text ">Work Log</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() =>
                    router.push("/common/assignment/Assignment" as any)
                }
                className="bg-card px-6 py-7 rounded-3xl flex-row items-center gap-4 "
            >
                <SimpleLineIcons name="notebook" size={ICONS_SIZE} />
                <Text className="font-bold text-xl text-text ">Assignment</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push("/common/fees/Selector" as any)}
                className="bg-card px-6 py-7 rounded-3xl flex-row items-center gap-4 "
            >
                <MaterialIcons name="currency-rupee" size={ICONS_SIZE} />
                <Text className="font-bold text-xl text-text ">
                    Manage Fees
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default TeacherOptions;
