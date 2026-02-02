import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useQuery } from '@tanstack/react-query'

import ProgressBar from "@components/common/ProgressBar.jsx";
import CircularProgress from "@components/common/CircularProgress.jsx";

import { fetchCloudinaryStats } from "@controller/admin/dashboard.controller.js"

const CloudinaryStats = ({ stats = {} }) => {
    return (
        <View className="px-3">
            <Text className="text-2xl font-black text-text-secondary">
                Cloud Storage
            </Text>
            <View className="pl-2">
                <Text className="text-lg font-semibold text-text">
                    You are currently in a{" "}
                    <Text className="font-bold text-lg text-text uppercase">
                        {stats.usage?.plan ?? "Free"}{" "}
                    </Text>
                    plan.
                </Text>
                <Text className="text-lg font-semibold text-text">
                    {stats?.resources} media files currently stored
                </Text>
                <View className="flex-1 items-center gap-3">
                    <CircularProgress
                        progress={stats.credits?.used_percent}
                        fraction={`${stats.credits?.usage ?? 0}/${
                            stats.credits?.limit ?? 25
                        }`}
                    />
                    <Text className="text-text text-xl font-bold">
                        Credit Usage
                    </Text>
                </View>
                <Text className="text-lg font-semibold text-text capitalize">
                    rate limit allowed : {stats.rate_limit_allowed}
                    rate limit remaining : {stats.rate_limit_remaining}
                    rate limit reset at :{" "}
                    {stats.rate_limit_reset_at?.toLocaleString()}
                </Text>
            </View>
            <ProgressBar progress={0.8} />
        </View>
    );
};

const Dashboard = () => {
    
    const {
        data: cloudinaryStats, isLoading
    } = useQuery({
        queryKey: ['cloudinaryStats'],
        queryFn: fetchCloudinaryStats
    })
    
    return (
        <ScrollView className="grow bg-primary pt-12">
            <CloudinaryStats stats={cloudinaryStats} loading ={isLoading}/>
        </ScrollView>
    );
};

export default Dashboard;
