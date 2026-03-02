import { useEffect } from "react";
import Animated, {
    useAnimatedRef,
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    scrollTo,
    withTiming,
    withDelay,
    withRepeat,
    useDerivedValue,
    FadeIn,
    FadeInDown,
    FadeOut
} from "react-native-reanimated";
import {
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    useColorScheme
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";

import CircularProgress from "@components/common/CircularProgress";
import Loader from "@components/common/Loader";
import { getOverallAttendenceReport } from "@controller/student/attendance.controller.js";
import { useAppStore } from "@store/app.store.js";

const { width: vw } = Dimensions.get("window");

const SCREEN_WIDTH = vw;
const CARD_WIDTH = SCREEN_WIDTH * 0.95;
const SIDE_SPACING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

const numberOfPies = 3;
const gap = vw * 0.1;
const size = (CARD_WIDTH - (numberOfPies - 1) * gap) / numberOfPies;

const STROKE_WIDTH = 10;

function hasPassed4PM() {
    const now = new Date();
    return now.getHours() >= 16;
}

const ReportCard = ({ studentId = null, isSingle = false }) => {
    const { data: report, isLoading } = useQuery({
        queryKey: ["OverallAttendenceReport", studentId],
        queryFn: () => getOverallAttendenceReport(studentId)
    });

    const role = useAppStore(state => state.user.role);

    const percentage = report?.summary?.currentPercentage ?? 0;
    const classesAttended = report?.summary?.classesAttended ?? 0;
    const totalClassesSoFar = report?.summary?.totalClassesSoFar ?? 0;
    const ongoingDays = report?.time_analysis?.ongoingDays ?? 0;

    const handlePress = () => {
        if (!totalClassesSoFar) return;
        router.push("(student)/(others)/AttendanceSummary");
    };

    const canTap = role !== "parent" && !!totalClassesSoFar;

    return (
        <View
            style={{
                width: !studentId || isSingle ? "100%" : CARD_WIDTH,
                marginRight: !studentId || isSingle ? 0 : SIDE_SPACING * 2,
                marginTop: 20,
                borderRadius: 24,
                overflow: "hidden"
            }}
        >
            <TouchableOpacity
                disabled={role === "parent"}
                onPress={handlePress}
                activeOpacity={1}
                className="bg-card border-border border"
                style={{ borderRadius: 24, padding: 20 }}
            >
                {/* Header row */}
                <View className="flex-row items-center justify-between mb-4 px-1">
                    {studentId ? (
                        <View className="bg-border rounded-full px-3 py-1 ml-2">
                            <Text className="text-xs font-bold text-text-secondary tracking-widest uppercase">
                                {studentId}
                            </Text>
                        </View>
                    ) : (
                        <Text className="text-xs font-bold text-text-secondary tracking-widest uppercase ml-1">
                            Monthly Report
                        </Text>
                    )}

                    {isLoading ? (
                        <Loader  /> 
                    ) : canTap ? (
                        <Animated.View
                            entering={FadeIn.delay(400)}
                            className="flex-row items-center gap-1"
                        >
                            <Text className="text-xs font-semibold text-text-secondary">
                                View details
                            </Text>
                            <Text className="text-text-secondary text-xs">
                                ›
                            </Text>
                        </Animated.View>
                    ) : null}
                </View>

                <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                        <CircularProgress
                            progress={percentage || 0}
                            size={size}
                        />
                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            className="text-center text-lg font-semibold mt-4 text-text"
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
                        />
                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            className="text-center text-lg font-semibold mt-4 text-text"
                        >
                            On Time
                        </Text>
                    </View>
                    <View className="flex-1">
                        <CircularProgress
                            progress={
                                hasPassed4PM()
                                    ? Math.max(0, ongoingDays - 1)
                                    : (ongoingDays ?? 0)
                            }
                            size={size}
                            showPercentage={false}
                            maxProgress={31}
                        />
                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            className="text-center text-lg font-semibold mt-4 text-text"
                        >
                            Ongoing Days
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const Dot = ({ index, scrollX, itemSize }) => {
    const animStyle = useAnimatedStyle(() => {
        const input = scrollX.value / itemSize;
        const distance = Math.abs(input - index);
        const t = Math.min(distance, 1);
        const width = 18 - t * 12;
        const opacity = 1 - t * 0.65;
        return { width, opacity };
    });

    return (
        <Animated.View
            style={[animStyle, { height: 6, borderRadius: 3 }]}
            className="bg-text-secondary"
        />
    );
};

const DotIndicators = ({ count, scrollX, itemSize }) => (
    <View
        style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 6,
            marginTop: 10
        }}
    >
        {Array.from({ length: count }).map((_, i) => (
            <Dot key={i} index={i} scrollX={scrollX} itemSize={itemSize} />
        ))}
    </View>
);

const MultiReports = ({ students }) => {
    const itemSize = CARD_WIDTH + SIDE_SPACING * 2;
    const scrollX = useSharedValue(0);

    const scrollHandler = e => {
        scrollX.value = e.nativeEvent.contentOffset.x;
    };

    return (
        <View>
            <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={itemSize}
                decelerationRate="fast"
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingHorizontal: SIDE_SPACING }}
            >
                {students?.map(item => (
                    <ReportCard key={item} studentId={item} />
                ))}
            </Animated.ScrollView>

            {students?.length > 1 && (
                <DotIndicators
                    count={students.length}
                    scrollX={scrollX}
                    itemSize={itemSize}
                />
            )}
        </View>
    );
};

export default function MonthlyAttendenceMiniReport() {
    const role = useAppStore(state => state.user?.role);
    const students = useAppStore(state => state.user?.students);

    if (role === "student" || students?.length === 1)
        return (
            <View className="px-2">
                <ReportCard studentId={students?.[0] ?? null} isSingle={true} />
            </View>
        );

    return <MultiReports students={students} />;
}
