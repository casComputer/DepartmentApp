import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    useColorScheme
} from "react-native";
import { useQuery } from "@tanstack/react-query";

import { getTodaysAttendanceReport } from "@controller/student/attendance.controller.js";
import { HOURS } from "@constants/ClassAndCourses.js";

const today = new Date();
const day = today.getDate();
const weekday = today.toLocaleString("en-US", { weekday: "long" });
const month = today.toLocaleString("en-US", { month: "long" });
const year = today.getFullYear();

const Bubble = ({ item, attendance }) => (
    <View
        style={{
            backgroundColor:
                attendance?.[item.id] === "present"
                    ? "rgb(34, 197, 94)"
                    : attendance?.[item.id] === "absent"
                    ? "rgb(239, 68, 68)"
                    : "rgb(156, 163, 175)",
            borderRadius: "50%"
        }}
        className="w-8 h-8 justify-center items-center">
        <Text className="text-white font-black text-xl">{item.key}</Text>
    </View>
);

const MiniAttentdenceCard = () => {
    const { data: attendance } = useQuery({
        queryKey: ["todaysAttendanceReport"],
        queryFn: getTodaysAttendanceReport
    });

    const theme = useColorScheme();

    return (
        <View className="px-6 mt-12">
            <TouchableOpacity
                style={{ elevation: 3 }}
                className="bg-white w-full rounded-3xl overflow-hidden p-8 gap-8 dark:bg-zinc-900">
                {/* Top */}

                <View className="flex-row items-center">
                    <Text className="text-black text-5xl font-bold dark:text-white">
                        {day}
                    </Text>
                    <View className="ml-5">
                        <Text className="text-black text-xl font-semibold dark:text-white ">
                            {weekday}
                        </Text>
                        <Text className="text-black text-md font-semibold dark:text-white">
                            {month} {year}
                        </Text>
                    </View>
                </View>

                <View>
                    <Text className="text-black text-xl font-semibold dark:text-white">
                        Todays Attendance
                    </Text>

                    <View className="flex-row items-center mt-4 gap-4">
                        {(attendance && Object.keys(attendance).length === 0) &&
                        (weekday.toLowerCase() === "saturday" ||
                            weekday.toLowerCase() === "sunday") ? (
                            <Text className="text-2xl font-bold dark:text-white">
                                Holiday 🎉
                            </Text>
                        ) : (
                            HOURS.map(item => (
                                <Bubble
                                    key={item.key}
                                    item={item}
                                    attendance={attendance}
                                />
                            ))
                        )}
                        {!attendance && (
                            <ActivityIndicator
                                color={theme == "dark" ? "black" : "white"}
                            />
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default MiniAttentdenceCard;
