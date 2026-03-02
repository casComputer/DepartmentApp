
import { useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    FadeIn,
    FadeInDown,
    FadeOut,
    ZoomIn
} from "react-native-reanimated";

import { useQuery } from "@tanstack/react-query";
import { getTodaysAttendanceReport } from "@controller/student/attendance.controller.js";
import { HOURS } from "@constants/ClassAndCourses.js";
import { useAppStore } from "@store/app.store.js";
import Loader from "@components/common/Loader";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH * 0.95;
const SIDE_SPACING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

const today = new Date();
const day = today.getDate();
const weekday = today.toLocaleString("en-US", { weekday: "long" });
const month = today.toLocaleString("en-US", { month: "long" });
const year = today.getFullYear();

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

const Bubble = ({ item, attendance, index }) => {
    const status = attendance?.[item.id];
    return (
        <Animated.View>
            <View
                style={{
                    backgroundColor:
                        status === "present"
                            ? "rgb(34, 197, 94)"
                            : status === "absent"
                              ? "rgb(239, 68, 68)"
                              : "rgb(120, 129, 143)",
                    borderRadius: 9999
                }}
                className="w-9 h-9 justify-center items-center"
            >
                <Text className="text-text font-black text-base">
                    {item.key}
                </Text>
            </View>
        </Animated.View>
    );
};

const MiniAttentdenceCard = ({ studentId = null, isSingle = false }) => {
    const { data: attendance, isLoading } = useQuery({
        queryKey: ["todaysAttendanceReport", studentId],
        queryFn: () => getTodaysAttendanceReport(studentId)
    });

    const isHoliday =
        attendance &&
        Object.keys(attendance).length === 0 &&
        (weekday.toLowerCase() === "saturday" ||
            weekday.toLowerCase() === "sunday");

    return (
        <View
            style={{
                width: studentId && !isSingle ? CARD_WIDTH : "100%",
                marginRight: SIDE_SPACING * 2
            }}
            className={`${!studentId || isSingle ? "px-2" : "mt-0"}`}
        >
            <Animated.View className="w-full rounded-3xl overflow-hidden bg-card border-border border">
                <View className="p-7 py-6 gap-5">
                    <View className="flex-row items-center justify-between">
                        {studentId ? (
                            <View className="bg-border rounded-full px-3 py-1">
                                <Text className="text-xs font-bold text-text-secondary tracking-widest uppercase">
                                    {studentId}
                                </Text>
                            </View>
                        ) : (
                            <View />
                        )}
                    </View>

                    <View className="flex-row items-end gap-3">
                        <Text
                            className="font-bold text-text"
                            style={{
                                fontSize: 64,
                                lineHeight: 64,
                                letterSpacing: -2
                            }}
                        >
                            {day}
                        </Text>
                        <View className="mb-1">
                            <Text className="text-xl font-bold text-text leading-tight">
                                {weekday}
                            </Text>
                            <Text className="text-sm font-medium text-text-secondary">
                                {month} {year}
                            </Text>
                        </View>
                    </View>

                    <View className="h-px bg-border opacity-60" />

                    <View className="gap-3">
                        <Text className="text-xs font-bold text-text-secondary tracking-widest uppercase">
                            Attendance
                        </Text>
                        <View className="flex-row items-center flex-wrap gap-2.5">
                            {isHoliday ? (
                                <Animated.View
                                    entering={FadeInDown.delay(150).springify()}
                                    className="flex-row items-center gap-2"
                                >
                                    <Text style={{ fontSize: 26 }}>🎉</Text>
                                    <Text className="text-2xl font-bold text-text">
                                        Holiday
                                    </Text>
                                </Animated.View>
                            ) : (
                                HOURS.map((item, index) => (
                                    <Bubble
                                        key={item.key}
                                        item={item}
                                        attendance={attendance}
                                        index={index}
                                    />
                                ))
                            )}
                            {isLoading && <Loader size={'large'} />}

                        </View>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

const MiniAttentdence = () => {
    const role = useAppStore(state => state.user.role);
    const students = useAppStore(state => state.user.students);

    const itemSize = CARD_WIDTH + SIDE_SPACING * 2;
    const isMulti = role !== "student" && students?.length > 1;
    const scrollX = useSharedValue(0);

    const scrollHandler = e => {
        scrollX.value = e.nativeEvent.contentOffset.x;
    };

    return (
        <View className="gap-4 mt-3">
            {!isMulti ? (
                <MiniAttentdenceCard
                    studentId={students?.[0] ?? null}
                    isSingle={true}
                />
            ) : (
                <View>
                    <Animated.ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={itemSize}
                        decelerationRate="fast"
                        contentContainerStyle={{
                            paddingHorizontal: SIDE_SPACING
                        }}
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                    >
                        {students?.map(item => (
                            <MiniAttentdenceCard key={item} studentId={item} />
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
            )}
        </View>
    );
};

export default MiniAttentdence;
