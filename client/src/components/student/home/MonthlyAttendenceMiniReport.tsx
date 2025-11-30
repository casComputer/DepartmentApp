import { useState } from "react";
import {
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    Dimensions
} from "react-native";
import { useQuery } from "@tanstack/react-query";

import CircularProgress from "@components/common/CircularProgress";
import { getMonthlyAttendenceMiniReport } from "@controller/student/attendance.controller.js";

const { width: vw } = Dimensions.get("window");

const numberOfPies = 3;
const containerWidth = vw * 0.95;
const gap = vw * 0.1;

const size = (containerWidth - (numberOfPies - 1) * gap) / numberOfPies;

export default function MonthlyAttendenceMiniReport() {
    const { data: report, status } = useQuery({
        queryKey: ["MonthlyAttendenceMiniReport"],
        queryFn: getMonthlyAttendenceMiniReport
    });

    return (
        <TouchableOpacity
            style={{
                elevation: 3,
                shadowColor: "black",
                width: containerWidth,
                gap: gap
            }}
            className="bg-white mx-auto mt-12 rounded-3xl overflow-hidden p-5 flex-row justify-between items-center dark:bg-zinc-900">
            <View className="flex-1">
                <CircularProgress
                    progress={report?.percentage || 0}
                    size={size}
                    strokeFillColor={"rgb(247,55,159)"}
                />
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    className="text-center text-lg font-semibold mt-4 dark:text-white">
                    Attendance
                </Text>
            </View>
            <View className="flex-1">
                <CircularProgress
                    progress={0}
                    maxProgress={30}
                    size={size}
                    showPercentage={false}
                    strokeFillColor={"rgb(247,55,159)"}
                />
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    className="text-center text-lg font-semibold mt-4 dark:text-white">
                    Leave Taken
                </Text>
            </View>
            <View className="flex-1">
                <CircularProgress
                    progress={report?.remainingDays || 0}
                    size={size}
                    showPercentage={false}
                    maxProgress={31}
                    strokeFillColor={"rgb(247,55,159)"}
                />
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    className="text-center text-lg font-semibold mt-4 dark:text-white">
                    Ongoing Days
                </Text>
            </View>
        </TouchableOpacity>
    );
}
