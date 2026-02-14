import { ScrollView, View } from "react-native";

import { Chart } from "@components/student/AttendanceReport.jsx";
import Header from "@components/common/Header.jsx";
import { AttendanceCalendar } from "@components/student/AttendanceCalendarReport.jsx";

const MonthlyReport = () => {
    
    return (
        <View className="flex-1">
            <Header title={"Attendance Report"} />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}
                alwaysBounceVertical
                bounces
                overScrollMode="always"
                contentContainerStyle={{ paddingBottom: 70, flexGrow: 1 }}
                className="bg-primary pt-16"
            >
                <AttendanceCalendar />
                <Chart />
            </ScrollView>
        </View>
    );
};

export default MonthlyReport;
