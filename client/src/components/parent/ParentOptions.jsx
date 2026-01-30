import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@icons";
import { router } from "expo-router"

const ICONS_SIZE = 30;

const ParentOptions = () => {
    return (
        <View className="px-2 mt-5 flex-1 gap-3">
            <TouchableOpacity
                onPress={() =>
                    router.push("/(parent)/(others)/AttendanceCalendar")
                }
                className="bg-card px-6 py-7 rounded-3xl flex-row items-center gap-4 "
            >
                <Feather name="calendar" size={ICONS_SIZE} />
                <Text className="font-bold text-xl text-text">
                    Attendance Calendar
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ParentOptions;
