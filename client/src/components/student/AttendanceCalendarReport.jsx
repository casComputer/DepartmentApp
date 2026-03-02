import { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import DateTimePickerAndroid from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { Feather } from "@icons";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    runOnJS,
    Easing
} from "react-native-reanimated";

import { generateAttendanceCalendarReport } from "@controller/student/attendance.controller";
import { calendarData } from "@utils/calenderData.js";

const SLIDE_DISTANCE = 400;
const DURATION = 280;
const easing = Easing.out(Easing.cubic);

const statusColors = {
    present: "text-green-500",
    leave: "text-red-500",
    "half-day": "text-yellow-500"
};

const CalendarItem = ({ day, status }) => {
    if (!day) return <View className="h-12 w-[14.28%]" />;

    return (
        <View className="flex items-center justify-center rounded-xl p-3 m-1">
            <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                className={`text-lg text-center font-bold w-full ${
                    statusColors[status] ?? "text-text"
                }`}
            >
                {day}
            </Text>
        </View>
    );
};

const CalendarGrid = ({ data, translateX }) => {
    const animStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    return (
        <Animated.View style={animStyle}>
            <FlashList
                data={data}
                keyExtractor={item => item.date}
                numColumns={7}
                estimatedItemSize={48}
                renderItem={({ item }) => (
                    <CalendarItem day={item.day} status={item.status} />
                )}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
            />
        </Animated.View>
    );
};

const PulsingCalendarIcon = () => {
    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.2, {
                duration: 600,
                easing: Easing.inOut(Easing.ease)
            }),
            -1,
            true
        );
    }, []);

    const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <Animated.View style={[style, { position: "absolute", right: "4.5%" }]}>
            <Feather name="calendar" size={20} color={"rgb(254,187,97)"} />
        </Animated.View>
    );
};

const CalendarDatePicker = ({ loading, date, onMonthDown, onMonthUp }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return (
        <View className="w-full pt-3 pb-2 flex-row items-center justify-center gap-6">
            <TouchableOpacity className="px-3" onPress={onMonthDown}>
                <Feather name="chevron-left" size={24} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text className="text-2xl font-bold text-text">
                    {month} {year}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity className="px-3" onPress={onMonthUp}>
                <Feather name="chevron-right" size={24} />
            </TouchableOpacity>

            {loading && <PulsingCalendarIcon />}

            {showDatePicker && (
                <DateTimePickerAndroid
                    mode="date"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (event.type === "set" && selectedDate) {
                            onMonthUp(selectedDate);
                        }
                    }}
                    value={date}
                />
            )}
        </View>
    );
};

export const AttendanceCalendar = ({ studentId = null }) => {
    const today = new Date();
    today.setDate(1);
    today.setHours(0, 0, 0, 0);
    const [date, setDate] = useState(today);

    const directionRef = useRef("right");
    const isAnimating = useRef(false);

    const year = date.getFullYear();
    const month = date.getMonth();

    const { data, isFetching } = useQuery({
        queryKey: ["attendanceCalendarReport", month, year, studentId],
        queryFn: () =>
            generateAttendanceCalendarReport(month + 1, year, studentId),
        placeholderData: calendarData(year, month)
    });

    const translateX = useSharedValue(0);

    const applyTimestamp = ts => {
        setDate(new Date(ts));
    };

    const onAnimationDone = () => {
        isAnimating.current = false;
    };

    const slideToDate = (newDate, direction) => {
        if (isAnimating.current) return;
        isAnimating.current = true;
        directionRef.current = direction;

        const outTarget =
            direction === "right" ? -SLIDE_DISTANCE : SLIDE_DISTANCE;
        const inStart =
            direction === "right" ? SLIDE_DISTANCE : -SLIDE_DISTANCE;
        const timestamp = newDate.getTime();

        translateX.value = withTiming(
            outTarget,
            { duration: DURATION, easing },
            () => {
                translateX.value = inStart;
                runOnJS(applyTimestamp)(timestamp);
            }
        );
    };

    const prevMonthKey = useRef(`${month}-${year}`);
    useEffect(() => {
        const currentKey = `${month}-${year}`;
        if (currentKey === prevMonthKey.current) return;
        prevMonthKey.current = currentKey;

        translateX.value = withTiming(0, { duration: DURATION, easing }, () => {
            runOnJS(onAnimationDone)();
        });
    }, [month, year]);

    const handleMonthDown = () => {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() - 1);
        slideToDate(newDate, "left");
    };

    const handleMonthUp = pickedDate => {
        let newDate;
        let direction;

        if (pickedDate instanceof Date && !isNaN(pickedDate)) {
            newDate = new Date(pickedDate);
            newDate.setDate(1);
            newDate.setHours(0, 0, 0, 0);
            direction = newDate < date ? "left" : "right";
        } else {
            newDate = new Date(date);
            newDate.setMonth(newDate.getMonth() + 1);
            direction = "right";
        }

        slideToDate(newDate, direction);
    };

    return (
        <View className="rounded-3xl bg-card border border-border p-2 mx-2 mt-5 overflow-hidden">
            <CalendarDatePicker
                date={date}
                onMonthDown={handleMonthDown}
                onMonthUp={handleMonthUp}
                loading={isFetching}
            />

            <View className="flex-row flex-wrap my-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <View key={day} className="w-[14.28%] items-center">
                        <Text className="text-xs text-text/60">{day}</Text>
                    </View>
                ))}
            </View>

            <CalendarGrid data={data} translateX={translateX} />
        </View>
    );
};
