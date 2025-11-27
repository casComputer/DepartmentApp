import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
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
        key={item.key}
        style={{
            backgroundColor:
                attendance?.[item.id] === "present"
                    ? "rgb(34, 197, 94)"
                    : attendance?.[item.id] === "absent"
                    ? "rgb(239, 68, 68)"
                    : "rgb(156, 163, 175)",
            borderRadius: "50%"
        }}
        className="w-8 h-8  justify-center items-center">
        <Text className="text-white font-black text-xl">{item.key}</Text>
    </View>
);

const MiniAttentdenceCard = () => {
    const { data: attendance} = useQuery({
        queryKey: ["todaysAttendanceReport"],
        queryFn: getTodaysAttendanceReport
    });



    return (
        <View className="px-6 mt-12">
            <TouchableOpacity
                style={{ elevation: 3, shadowColor: "black" }}
                className=" bg-white w-full rounded-3xl overflow-hidden p-8 gap-8">
                {/* Top */}

                <View className="flex-row items-center">
                    <Text className="text-black text-5xl font-bold">{day}</Text>
                    <View className="ml-5">
                        <Text className="text-black text-xl font-semibold">
                            {weekday}
                        </Text>
                        <Text className="text-black text-md font-semibold ">
                            {month} {year}
                        </Text>
                    </View>
                </View>

                <View>
                    <Text className="text-black text-xl font-semibold ">
                        Todays Attendance
                    </Text>

                    <View className="flex-row items-center mt-4 gap-4">
                        {!attendance ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            HOURS.map(item => (
                                <Bubble item={item} attendance={attendance} />
                            ))
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default MiniAttentdenceCard;
