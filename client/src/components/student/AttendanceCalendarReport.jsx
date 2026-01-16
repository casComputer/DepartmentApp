import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import DateTimePickerAndroid from "@react-native-community/datetimepicker";
import { Feather } from "@icons";

import { generateAttendanceCalendarReport } from "@controller/student/attendance.controller";

const CalendarItem = ({ day, status }) => {
  const statusColors = {
    present: "text-green-500",
    absent: "text-red-500",
  };

  return (
    <View className="flex items-center justify-center rounded-xl p-4 m-1">
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        className={`text-lg font-bold ${statusColors[status] || "text-text"}`}
      >
        {day}
      </Text>
    </View>
  );
};

const CalendarDatePicker = ({ date, setDate }) => {
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
    <View className="w-full h-16 flex-row items-center justify-center gap-6 ">
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

  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  const calendarData = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    status: "na",
    date: new Date(date.getFullYear(), date.getMonth(), i + 1)
      .toISOString()
      ?.split("T")[0],
  }));

  const [report, setReport] = useState(calendarData || []);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);

      const fetchedReport = await generateAttendanceCalendarReport(
        date.getMonth() + 1,
        date.getFullYear()
      );

      setReport((prev) =>
        prev.map((item) => {
          if (fetchedReport[item.date]) {
            return { ...item, status: fetchedReport[item.date]?.status };
          }
          return {
            ...item,
            status: fetchedReport[item.date] || "na",
          };
        })
      );

      setLoading(false);
    };

    fetchReport();
  }, [date]);

  return (
    <View className="rounded-3xl bg-card p-2 mx-2 mt-5">
      <CalendarDatePicker setReport={setReport} date={date} setDate={setDate} />
      {loading && <ActivityIndicator size="small" />}
      <FlashList
        data={report}
        renderItem={({ item }) => (
          <CalendarItem day={item.day} status={item.status} />
        )}
        keyExtractor={(item) => item.date}
        numColumns={7}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
