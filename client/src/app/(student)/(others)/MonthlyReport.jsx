import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeStore } from "@store/app.store.js";

import { SelectYear, Chart } from "@components/student/AttendanceReport.jsx";

const MonthlyReport = () => {
    const gradientColors = useThemeStore(state => state.gradientColors);

    console.log(new Date('2025', 0, 1));

    return (
        <LinearGradient colors={gradientColors} className="flex-1">
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}
                alwaysBounceVertical
                bounces
                overScrollMode="always"
                className="pt-24 dark:bg-black">
                <SelectYear />

                <Chart />
            </ScrollView>
        </LinearGradient>
    );
};

export default MonthlyReport;
