import { useEffect, useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import DateTimePickerAndroid from "@react-native-community/datetimepicker";
import { Feather } from "@icons";

import { generateAttendanceCalendarReport } from "@controller/student/attendance.controller";

const CalendarItem = ({ day, status }) => {
    const statusColors = {
        present: "text-green-500",
        absent: "text-red-500"
    };

    if (!day) {
        return <View className="h-12 w-[14.28%]" />;
    }

    return (
        <View className="flex items-center justify-center rounded-xl p-3 m-1">
            <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                className={`text-lg font-bold ${
                    statusColors[status] || "text-text"
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
            {loading && <ActivityIndicator size="small" style={{ position: 'absolute', right : '4.5%'}} />}

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

export const AttendanceCalendar = () => {
    const [date, setDate] = useState(new Date(new Date().setDate(1)));
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState([]);

    const year = date.getFullYear();
    const month = date.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 0 = Sunday, 6 = Saturday
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // 🔹 Generate calendar data with weekday offset
    const calendarData = useMemo(() => {
        const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => ({
            day: null,
            status: "empty",
            date: `empty-${i}`
        }));

        const monthDays = Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
            status: "na",
            date: new Date(year, month, i + 1).toISOString().split("T")[0]
        }));

        return [...emptyDays, ...monthDays];
    }, [year, month]);

    // Reset calendar when month changes
    useEffect(() => {
        setReport(calendarData);
    }, [calendarData]);

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);

            const fetchedReport = await generateAttendanceCalendarReport(
                month + 1,
                year
            );

            setReport(prev =>
                prev.map(item => {
                    if (!item.day) return item;

                    return {
                        ...item,
                        status:
                            fetchedReport[item.date]?.status ||
                            fetchedReport[item.date] ||
                            "na"
                    };
                })
            );

            setLoading(false);
        };

        fetchReport();
    }, [month, year]);

    return (
        <View className="rounded-3xl bg-card p-2 mx-2 mt-5">
            <CalendarDatePicker
                date={date}
                setDate={setDate}
                setReport={setReport}
                loading={loading}
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
                data={report}
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
