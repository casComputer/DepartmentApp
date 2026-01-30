import { View, Text } from "react-native";

import Header from "@components/common/Header2.jsx";
import LeaderBoard from "@components/student/AttendanceLeaderboard.jsx";

import queryClient from "@utils/queryClient.js";

import { useAppStore } from "@store/app.store.js";

const ShortSummary = ({ summary, time_analysis, projections }) => {
    return (
        <View className="px-3 py-4 mt-8 gap-1 rounded-3xl mx-2 bg-card">
            <Text className="text-text text-2xl font-bold ">
                ⚡Quick Overview
            </Text>

            <Text className="mt-3 text-text-secondary text-md font-bold text-center">
                You attended {summary?.classesAttended} of{" "}
                {summary?.totalClassesSoFar}{" "}
                {summary?.totalClassesSoFar > 1 ? "classes" : "class"}
            </Text>

            <Text
                className={`text-sm text-center ${
                    projections?.isCritical
                        ? "text-red-500"
                        : "text-text-secondary"
                }`}
            >
                {projections?.message}
            </Text>

            <Text className=" text-text-secondary text-sm text-center">
                Estimated attendance if all remaining classes were attended:{" "}
                <Text className="font-black">
                    {projections?.expectedMaxPercentage}
                </Text>
            </Text>

            <Text className="mt-3 text-text-secondary text-md text-center">
                Attendance Status: {summary?.status + "\n"}
                Remaining Days: {time_analysis?.remainingDays + "\n"}
                Remaining Hours: {time_analysis?.remainingHours}
            </Text>
        </View>
    );
};

const AttendanceSummary = () => {
    const report =
        queryClient.getQueryData(["OverallAttendenceReport", null]) ?? {};

    return (
        <View className="flex-1 bg-primary">
            <Header title="Attendance Summary" />
            <LeaderBoard comparison={report?.comparison} />

            <ShortSummary
                summary={report?.summary}
                projections={report?.projections}
                time_analysis={report?.time_analysis}
            />
        </View>
    );
};

export default AttendanceSummary;
