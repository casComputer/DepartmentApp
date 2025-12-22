import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import Header from "@components/common/Header.jsx";

const AttendanceManage = () => {
    return (
        <View className="flex-1 bg-primary px-2 gap-3 mt-3">
            <Header title={"Attendance"} />
            <TouchableOpacity
                onPress={() =>
                    router.push("/common/attendance/AttendanceClassSelect")
                }
                className="px-3 py-7 rounded-3xl bg-btn"
            >
                <Text className="text-text font-bold text-xl">
                    Take Attendance
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>
                    router.push("/common/attendance/AttendanceHistory")
                }
                className="px-3 py-7 rounded-3xl bg-btn"
            >
                <Text className="text-text font-bold text-xl">My History</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>
                    router.push({
                        pathname: "/common/attendance/AttendanceClassSelect",
                        params: {
                            course: in_charge_class,
                            year: in_charge_year
                        }
                    })
                }
                className="px-3 py-7 rounded-3xl bg-btn"
            >
                <Text className="text-text font-bold text-xl">
                    Class History
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default AttendanceManage;
