import { ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useThemeStore } from "@store/app.store.js";

import { SelectYear, Chart } from "@components/student/AttendanceReport.jsx";
import Header from "@components/common/Header.jsx";
import { AttendanceCalendar } from "@components/student/AttendanceCalendarReport.jsx";

const MonthlyReport = () => {
  const gradientColors = useThemeStore((state) => state.gradientColors);

  return (
    <LinearGradient colors={gradientColors} className="flex-1">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical
        bounces
        overScrollMode="always"
        contentContainerStyle={{ paddingBottom: 70, flexGrow: 1 }}
        className="bg-primary"
      >
        <Header title={"Attendance Report"} />
        <AttendanceCalendar />
        <View className="mt-10">
          <SelectYear />
          <Chart />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default MonthlyReport;
