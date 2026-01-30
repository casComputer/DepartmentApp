import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import DateTimePickerAndroid from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { Feather } from "@icons";

import { generateAttendanceCalendarReport } from "@controller/student/attendance.controller";

import { calendarData } from "@utils/calenderData.js";

const CalendarItem = ({ day, status }) => {
    const statusColors = {
        present: "text-green-500",
        absent: "text-red-500",
        "half-day": "text-yellow-500"
    };

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

const CalendarDatePicker = ({ loading, date, setDate }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const handleMonthDown = () => {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() - 1);
        setDate(newDate);
    };

    const handleMonthUp = () => {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + 1);
        setDate(newDate);
    };

    return (
        <View className="w-full pt-3 pb-2 flex-row items-center justify-center gap-6 ">
            <TouchableOpacity onPress={handleMonthDown}>
                <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text className="text-2xl font-bold dark:text-white ">
                    {month} {year}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMonthUp}>
                <Feather name="chevron-right" size={24} />
            </TouchableOpacity>
            {loading && (
                <ActivityIndicator
                    size="small"
                    style={{ position: "absolute", right: "4.5%" }}
                />
            )}

            {showDatePicker && (
                <DateTimePickerAndroid
                    mode="date"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (event.type === "set" && selectedDate) {
                            setDate(selectedDate);
                        }
                    }}
                    value={date}
                />
            )}
        </View>
    );
};

export const AttendanceCalendar = ({ studentId=null}) => {
    const [date, setDate] = useState(new Date(new Date().setDate(1)));

    const year = date.getFullYear();
    const month = date.getMonth();

    const { data, isLoading } = useQuery({
        queryKey: ["attendanceCalendarReport", month, year, studentId],
        queryFn: () => generateAttendanceCalendarReport(month + 1, year, studentId),
        initialData: calendarData(year, month)
    });

    return (
        <View className=" rounded-3xl bg-card p-2 mx-2 mt-5">
            <CalendarDatePicker
                date={date}
                setDate={setDate}
                loading={isLoading}
            />

            {/* Weekday header */}
            <View className="flex-row flex-wrap my-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <View key={day} className="w-[14.28%] items-center">
                        <Text className="text-xs text-text/60">{day}</Text>
                    </View>
                ))}
            </View>

            <FlashList
                data={data}
                keyExtractor={item => item.date}
                numColumns={7}
                estimatedItemSize={48}
                renderItem={({ item }) => (
                    <CalendarItem day={item.day} status={item.status} />
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};
