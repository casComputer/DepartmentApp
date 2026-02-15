import { View, Text, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";

import ProgressBar from "@components/common/ProgressBar.jsx";
import CircularProgress from "@components/common/CircularProgress.jsx";

import {
    fetchCloudinaryStats,
    fetchTursoStats, fetchUserStats
} from "@controller/admin/dashboard.controller.js";

import { formatUsage } from "@utils/formateTursoStats.js";

const CloudinaryStats = () => {
    const { data: stats = {} } = useQuery({
        queryKey: ["cloudinaryStats"],
        queryFn: fetchCloudinaryStats
    });
    return (
        <View className="border border-border px-3 bg-card py-5 mx-2 rounded-2xl">
            <Text className="text-2xl font-black text-text-secondary">
                Cloud Storage
            </Text>
            <View className="pl-2 py-4">
                <Text className="text-md font-semibold text-text">
                    You are currently in a{" "}
                    <Text className="font-bold text-lg text-text uppercase">
                        {stats.usage?.plan ?? "Free"}{" "}
                    </Text>
                    plan.
                </Text>
                <Text className="text-md font-semibold text-text">
                    {stats?.resources} media files currently stored
                </Text>
                <View className="flex-1 items-center gap-3 my-4">
                    <CircularProgress
                        progress={stats.credits?.used_percent}
                        fraction={`${stats.credits?.usage ?? 0}/${
                            stats.credits?.limit ?? 25
                        }`}
                        size={150}
                        strokeWidth={14}
                    />
                    <Text className="text-text text-xl font-black -mt-1">
                        Credit Usage
                    </Text>
                </View>
                <Text className="text-lg font-semibold text-text capitalize">
                    rate limit allowed : {stats.rate_limit_allowed + "\n"}
                    rate limit remaining : {stats.rate_limit_remaining + "\n"}
                    rate limit reset at :{" "}
                    <Text className="text-lg font-bold text-text">
                        {stats.rate_limit_reset_at
                            ?.split("T")
                            .join(" ")
                            .substring(0, 16) || "N/A"}
                    </Text>
                </Text>
            </View>
            {/* <ProgressBar progress={0.8} /> */}
        </View>
    );
};

const TursoStats = () => {
    const { data: stats = {} } = useQuery({
        queryKey: ["tursoStats"],
        queryFn: fetchTursoStats
    });

    const { reads, writes, storage } = formatUsage({
        rows_read: stats.usage?.rows_read ?? 0,
        rows_written: stats.usage?.rows_written ?? 0,
        storage_bytes: stats.usage?.storage_bytes ?? 0
    });

    return (
        <View className="border border-border px-3 bg-card py-5 mx-2 rounded-2xl mt-5">
            <Text className="text-2xl font-black text-text-secondary">
                Database Storage
            </Text>
            <View className="pl-2 py-4 gap-1">
                <View className="flex-row items-center justify-between">
                    <Text className="text-md font-semibold text-text">
                        Rows Read
                    </Text>
                    <View className="flex-row items-center justify-end gap-2">
                        <ProgressBar progress={reads.progress} width={"50%"} />
                        <Text
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            className="text-md font-semibold text-text w-[20%]"
                        >
                            {reads.text}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-between">
                    <Text className="text-md font-semibold text-text">
                        Rows Written
                    </Text>
                    <View className="flex-row items-center justify-end gap-2">
                        <ProgressBar progress={writes.progress} width={"50%"} />
                        <Text
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            className="text-md font-semibold text-text w-[20%]"
                        >
                            {writes.text}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-between">
                    <Text className="text-md font-semibold text-text">
                        Storage Usage
                    </Text>
                    <View className="flex-row items-center justify-end gap-2">
                        <ProgressBar
                            progress={storage.progress}
                            width={"50%"}
                        />
                        <Text
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            className="text-md font-semibold text-text w-[20%]"
                        >
                            {storage.text}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const UsersStats = () => {
    const { data: stats = {} } = useQuery({
        queryKey: ["userStats"],
        queryFn: fetchUserStats
    });

    console.log(stats);

    return <View></View>;
};

const Dashboard = () => {
    return (
        <ScrollView className="grow bg-primary pt-8">
            <CloudinaryStats />
            <TursoStats />
            <UsersStats />
        </ScrollView>
    );
};

export default Dashboard;
