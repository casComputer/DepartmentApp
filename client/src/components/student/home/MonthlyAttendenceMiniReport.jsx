import { useState, useEffect } from "react";
import Animated, {
    useAnimatedRef,
    useSharedValue,
    scrollTo,
    withTiming,
    withDelay,
    useDerivedValue
} from "react-native-reanimated";
import {
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    FlatList
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";

import CircularProgress from "@components/common/CircularProgress";
import { getOverallAttendenceReport } from "@controller/student/attendance.controller.js";

import { useAppStore } from "@store/app.store.js";

const { width: vw } = Dimensions.get("window");

const SCREEN_WIDTH = vw;
const CARD_WIDTH = SCREEN_WIDTH * 0.95;
const SIDE_SPACING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

const numberOfPies = 3;
const gap = vw * 0.1;

const size = (CARD_WIDTH - (numberOfPies - 1) * gap) / numberOfPies;

const ReportCard = ({ studentId = null }) => {
    const { data: report } = useQuery({
        queryKey: ["OverallAttendenceReport", studentId],
        queryFn: () => getOverallAttendenceReport(studentId)
    });

    const role = useAppStore(state => state.user.role);

    const percentage = report?.summary?.currentPercentage ?? 0;
    const classesAttended = report?.summary?.classesAttended ?? 0;
    const totalClassesSoFar = report?.summary?.totalClassesSoFar ?? 0;
    const ongoingDays = report?.time_analysis?.ongoingDays ?? 0;

    return (
        <TouchableOpacity
            style={{
                width: CARD_WIDTH,
                marginRight: SIDE_SPACING * 2,
                boxShadow: "0 3px 4px rgba(0, 0, 0, 0.5)"
            }}
            disabled={role === "parent"}
            onPress={() => router.push("(student)/(others)/AttendanceSummary")}
            activeOpacity={0.75}
            className="mx-auto mt-5 rounded-3xl overflow-hidden p-5 bg-card"
        >
            {studentId ? (
                <Text className="text-lg pl-4 pb-1 font-black text-text-secondary">
                    {studentId}
                </Text>
            ) : null}
            <View className="flex-row justify-between items-center">
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
                        progress={
                            totalClassesSoFar > 0 &&
                            (classesAttended / totalClassesSoFar) * 100
                        }
                        size={size}
                        fraction={`${classesAttended}/${totalClassesSoFar} Days`}
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
                        progress={ongoingDays ?? 0}
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
            </View>
        </TouchableOpacity>
    );
};

const MultiReports = () => {
    const students = useAppStore(state => state.user?.students);

    const itemSize = CARD_WIDTH + SIDE_SPACING * 2;
    const maxOffset = itemSize * (students?.length - 1);

    const scrollRef = useAnimatedRef();
    const scrollX = useSharedValue(maxOffset);

    useDerivedValue(() => {
        scrollTo(scrollRef, scrollX.value, 0, false);
    });

    useEffect(() => {
        if (!students || students?.length <= 1) return;

        scrollX.value = withDelay(
            50,
            withTiming(0, {
                duration: 500
            })
        );
    }, [students]);

    return (
        <View>
            <Animated.ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + SIDE_SPACING * 2}
                decelerationRate="fast"
                contentContainerStyle={{
                    paddingHorizontal: SIDE_SPACING
                }}
            >
                {students?.map(item => (
                    <ReportCard key={item} studentId={item} />
                ))}
            </Animated.ScrollView>
        </View>
    );
};

export default function MonthlyAttendenceMiniReport() {
    const role = useAppStore(state => state.user?.role);

    if (role === "student")
        return (
            <View className="px-3">
                <ReportCard />
            </View>
        );

    return <MultiReports />;
}
