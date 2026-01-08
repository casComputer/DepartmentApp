import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import Header from "@components/common/Header.jsx";

import { useAppStore } from "@store/app.store.js";

const AttendanceManage = () => {
    const in_charge_course = useAppStore(
        (state) => state.user.in_charge_course
    );
    const in_charge_year = useAppStore((state) => state.user.in_charge_year);

    return (
        <View className="flex-1 bg-primary px-2 gap-3">
            <Header title={"Attendance"} />

            <TouchableOpacity
                onPress={() =>
                    router.push("/common/attendance/AttendanceClassSelect")
                }
                className="px-4 py-7 rounded-3xl bg-card"
            >
                <Text className="text-text font-bold text-xl">
                    Take Attendance
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>
                    router.push("/common/attendance/AttendanceHistory")
                }
                className="px-4 py-7 rounded-3xl bg-card"
            >
                <Text className="text-text font-bold text-xl">My History</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>
                    router.push({
                        pathname: "/common/attendance/AttendanceClassHistory",
                        params: {
                            course: in_charge_course,
                            year: in_charge_year,
                        },
                    })
                }
                className="px-4 py-7 rounded-3xl bg-card"
            >
                <Text className="text-text font-bold text-xl">
                    Class History
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default AttendanceManage;
