import { useState } from "react";
import {
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    Dimensions
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";

import CircularProgress from "@components/common/CircularProgress";
import { getOverallAttendenceReport } from "@controller/student/attendance.controller.js";

const { width: vw } = Dimensions.get("window");

const numberOfPies = 3;
const containerWidth = vw * 0.95;
const gap = vw * 0.1;

const size = (containerWidth - (numberOfPies - 1) * gap) / numberOfPies;

export default function MonthlyAttendenceMiniReport() {
    const { data: report, status } = useQuery({
        queryKey: ["OverallAttendenceReport"],
        queryFn: getOverallAttendenceReport
    });
    
    const percentage = report?.summary?.currentPercentage ?? 0
    const classesAttended = report?.summary?.classesAttended ?? 0
    const totalClassesSoFar = report?.summary?.totalClassesSoFar ?? 0
    const remainingDays = report?.time_analysis?.remainingDays ?? 0

    return (
        <TouchableOpacity
        onPress={()=> router.push("(student)/(others)/AttendanceSummary")}
            activeOpacity={0.75}
            style={{
                boxShadow: "0 3px 4px rgba(0, 0, 0, 0.5)",
                width: containerWidth,
                gap: gap
            }}
            className="mx-auto mt-5 rounded-3xl overflow-hidden p-5 flex-row justify-between items-center bg-card"
        >
            <View className="flex-1">
                <CircularProgress
                    progress={percentage || 0}
                    size={size}
                    strokeFillColor={"rgb(247,55,159)"}
                />
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    className="text-center text-lg font-semibold mt-4 dark:text-white"
                >
                    Attendance
                </Text>
            </View>
            <View className="flex-1">
                <CircularProgress
                    progress={totalClassesSoFar > 0 && classesAttended / totalClassesSoFar *100}
                    size={size}
                    fraction={`${classesAttended}/${totalClassesSoFar}`}
                    strokeFillColor={"rgb(247,55,159)"}
                />
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    className="text-center text-lg font-semibold mt-4 dark:text-white"
                >
                    On Time
                </Text>
            </View>
            <View className="flex-1">
                <CircularProgress
                    progress={remainingDays || 0}
                    size={size}
                    showPercentage={false}
                    maxProgress={31}
                    strokeFillColor={"rgb(247,55,159)"}
                />
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    className="text-center text-lg font-semibold mt-4 dark:text-white"
                >
                    Ongoing Days
                </Text>
            </View>
        </TouchableOpacity>
    );
}
