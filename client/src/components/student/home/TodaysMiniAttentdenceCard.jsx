import { useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    Dimensions
} from "react-native";
import Animated, {
    useAnimatedRef,
    useSharedValue,
    scrollTo,
    withTiming,
    withDelay,
    useDerivedValue
} from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";

import { getTodaysAttendanceReport } from "@controller/student/attendance.controller.js";

import { HOURS } from "@constants/ClassAndCourses.js";

import { useAppStore } from "@store/app.store.js";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH * 0.95;
const SIDE_SPACING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

const today = new Date();
const day = today.getDate();
const weekday = today.toLocaleString("en-US", {
    weekday: "long"
});
const month = today.toLocaleString("en-US", {
    month: "long"
});
const year = today.getFullYear();

const Bubble = ({ item, attendance }) => (
    <View
        style={{
            backgroundColor:
                attendance?.[item.id] === "present"
                    ? "rgb(34, 197, 94)"
                    : attendance?.[item.id] === "absent"
                    ? "rgb(239, 68, 68)"
                    : "rgb(120, 129, 143)",
            borderRadius: "50%"
        }}
        className="w-8 h-8 justify-center items-center"
    >
        <Text className="text-text font-black text-xl">{item.key}</Text>
    </View>
);

const MiniAttentdenceCard = ({ studentId = null, isSingle = false }) => {
    const { data: attendance, isLoading } = useQuery({
        queryKey: ["todaysAttendanceReport", studentId],
        queryFn: () => getTodaysAttendanceReport(studentId)
    });

    return (
        <View
            style={{
                width: studentId && !isSingle ? CARD_WIDTH : "100%",
                marginRight: SIDE_SPACING * 2
            }}
            className={`${!studentId || isSingle ? "px-2" : "mt-0"}`}
        >
            <View
                style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
                className="w-full rounded-3xl overflow-hidden p-8 py-6 bg-card border-border border"
            >
                {/* Top */}
                {studentId ? (
                    <Text className="text-lg font-black text-text-secondary">
                        {studentId}
                    </Text>
                ) : null}

                <View className="flex-row items-center my-4">
                    <Text className="text-5xl font-bold text-text">{day}</Text>
                    <View className="ml-5">
                        <Text className="text-xl font-semibold text-text ">
                            {weekday}
                        </Text>
                        <Text className="text-md font-semibold text-text">
                            {month} {year}
                        </Text>
                    </View>
                </View>

                <View>
                    <Text className="text-text text-xl font-semibold">
                        Todays Attendance
                    </Text>

                    <View className="flex-row items-center mt-4 gap-4">
                        {attendance &&
                        Object.keys(attendance).length === 0 &&
                        (weekday.toLowerCase() === "saturday" ||
                            weekday.toLowerCase() === "sunday") ? (
                            <Text className="text-2xl font-bold text-text">
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
                        {isLoading && <ActivityIndicator size="large" />}
                    </View>
                </View>
            </View>
        </View>
    );
};

const MiniAttentdence = () => {
    const role = useAppStore(state => state.user.role);
    const students = useAppStore(state => state.user.students);

    const itemSize = CARD_WIDTH + SIDE_SPACING * 2;
    const maxOffset = itemSize * (students?.length - 1) ?? 0;

    const scrollRef = useAnimatedRef();
    const scrollX = useSharedValue(maxOffset);

    useDerivedValue(() => {
        scrollTo(scrollRef, scrollX.value, 0, false);
    });

    useEffect(() => {
        if (!students || students.length <= 1) return;

        scrollX.value = withDelay(
            50,
            withTiming(0, {
                duration: 500
            })
        );
    }, [students]);

    return (
        <View className="gap-4 mt-12">
            {role === "student" || students.length === 1 ? (
                <MiniAttentdenceCard
                    studentId={students?.[0] ?? null}
                    isSingle={true}
                />
            ) : (
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
                        <MiniAttentdenceCard key={item} studentId={item} />
                    ))}
                </Animated.ScrollView>
            )}
        </View>
    );
};

export default MiniAttentdence;
