import { View, Text, ScrollView } from "react-native";

import Header from "@components/common/Header2.jsx";
import LeaderBoard from "@components/student/AttendanceLeaderboard.jsx";

import queryClient from "@utils/queryClient.js";

import { useAppStore } from "@store/app.store.js";

const StatRow = ({ label, value }) => (
    <View className="flex-row items-center justify-between px-1 py-2 border-b border-border/50">
        <Text className="text-text-secondary text-sm font-semibold">{label}</Text>
        <Text className="text-text text-sm font-black">{value}</Text>
    </View>
);

const ShortSummary = ({ summary, time_analysis, projections }) => {
    const attendedOf = `${summary?.classesAttended ?? 0} / ${summary?.totalClassesSoFar ?? 0}`;
    const isCritical = projections?.isCritical;

    return (
        <View className="mx-2 mt-6 rounded-3xl bg-card border border-border overflow-hidden">
            {/* Header band */}
            <View className="px-4 pt-5 pb-4 gap-1">
                <Text className="text-xs font-bold text-text-secondary tracking-widest uppercase">
                    Quick Overview
                </Text>
                <Text className="text-text text-2xl font-black leading-tight">
                    ⚡ At a Glance
                </Text>
            </View>

            <View className="h-px bg-border opacity-50 mx-4" />

            {/* Classes attended big stat */}
            <View className="items-center py-5 gap-1">
                <Text className="text-text-secondary text-xs font-bold tracking-widest uppercase">
                    Classes Attended
                </Text>
                <Text className="text-text font-black" style={{ fontSize: 48, lineHeight: 52, letterSpacing: -1 }}>
                    {attendedOf}
                </Text>
                <Text className="text-text-secondary text-xs font-semibold">
                    {summary?.totalClassesSoFar > 1 ? "classes" : "class"} so far
                </Text>
            </View>

            <View className="h-px bg-border opacity-50 mx-4" />

            {/* Projection message */}
            <View className={`mx-4 mt-4 px-4 py-3 rounded-2xl ${isCritical ? "bg-red-500/10" : "bg-card-selected"}`}>
                <Text className={`text-sm font-semibold text-center leading-5 ${isCritical ? "text-red-500" : "text-text-secondary"}`}>
                    {projections?.message}
                </Text>
            </View>

            {/* Stat rows */}
            <View className="px-4 mt-4 pb-2">
                <StatRow
                    label="Max possible attendance"
                    value={`${projections?.expectedMaxPercentage ?? "—"}`}
                />
                <StatRow
                    label="Status"
                    value={summary?.status ?? "—"}
                />
                <StatRow
                    label="Remaining days"
                    value={time_analysis?.remainingDays ?? "—"}
                />
                <StatRow
                    label="Remaining hours"
                    value={time_analysis?.remainingHours ?? "—"}
                />
            </View>

            <View className="pb-4" />
        </View>
    );
};

const AttendanceSummary = () => {
    const report =
        queryClient.getQueryData(["OverallAttendenceReport", null]) ?? {};

    return (
        <View className="flex-1 bg-primary">
            <Header />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <LeaderBoard comparison={report?.comparison} />
                <ShortSummary
                    summary={report?.summary}
                    projections={report?.projections}
                    time_analysis={report?.time_analysis}
                />
            </ScrollView>
        </View>
    );
};

export default AttendanceSummary;
