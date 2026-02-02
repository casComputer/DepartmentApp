import { View, Text, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";

import ProgressBar from "@components/common/ProgressBar.jsx";
import CircularProgress from "@components/common/CircularProgress.jsx";

import {
    fetchCloudinaryStats,
    fetchTursoStats,
} from "@controller/admin/dashboard.controller.js";

const CloudinaryStats = ({ stats = {} }) => {
    return (
        <View className="px-3 bg-card py-5 mx-2 rounded-2xl">
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

const TursoStats = ({ stats = {} }) => {
    stats = stats.usage ?? {};

    return (
        <View className="px-3 bg-card py-5 mx-2 rounded-2xl mt-5">
            <Text className="text-2xl font-black text-text-secondary">
                Database Storage
            </Text>
            <View className="pl-2 py-4">
                <Text className="text-md font-semibold text-text">
                    Rows Read: {stats.rows_read}
                </Text>
                <Text className="text-md font-semibold text-text">
                    Rows Write: {stats.rows_written}
                </Text>

                <Text className="text-md font-semibold text-text">
                    Storage Used: {stats.storage_bytes}
                </Text>
            </View>
        </View>
    );
};

const Dashboard = () => {
    const { data: cloudinaryStats, isLoading: cloudinaryLoading } = useQuery({
        queryKey: ["cloudinaryStats"],
        queryFn: fetchCloudinaryStats,
    });

    const { data: tursoStats, isLoading: tursoLoading } = useQuery({
        queryKey: ["tursoStats"],
        queryFn: fetchTursoStats,
    });

    return (
        <ScrollView className="grow bg-primary pt-12">
            <CloudinaryStats
                stats={cloudinaryStats}
                loading={cloudinaryLoading}
            />
            <TursoStats stats={tursoStats} loading={tursoLoading} />
        </ScrollView>
    );
};

export default Dashboard;
