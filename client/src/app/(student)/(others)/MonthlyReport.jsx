import { ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useThemeStore } from "@store/app.store.js";

import { SelectYear, Chart } from "@components/student/AttendanceReport.jsx";

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
                className="pt-24 dark:bg-black"
            >
                <SelectYear />

                <Chart />
            </ScrollView>
        </LinearGradient>
    );
};

export default MonthlyReport;
