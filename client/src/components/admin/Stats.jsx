import { View, Text, Pressable } from "react-native";
import { useQuery } from "@tanstack/react-query";

import React, { useEffect, useRef } from "react";

import Animated, {
    Easing,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from "react-native-reanimated";

import ProgressBar from "@components/common/ProgressBar.jsx";
import CircularProgress from "@components/common/CircularProgress.jsx";

import {
    fetchCloudinaryStats,
    fetchTursoStats,
    fetchUserStats
} from "@controller/admin/dashboard.controller.js";

import { formatUsage } from "@utils/formateTursoStats.js";

const StatPill = ({ label, value }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const onPress = () => {
        scale.value = withSpring(0.95, {}, () => {
            scale.value = withSpring(1);
        });
    };

    return (
        <Pressable onPress={onPress}>
            <Animated.View
                style={animatedStyle}
                className="flex-row items-center justify-between border border-border rounded-xl px-4 py-3 bg-card mb-2"
            >
                <Text className="text-text-secondary text-sm font-medium capitalize">
                    {label}
                </Text>
                <Text className="text-text font-bold text-sm">{value}</Text>
            </Animated.View>
        </Pressable>
    );
};

export const CloudinaryStats = () => {
    const { data: stats = {} } = useQuery({
        queryKey: ["cloudinaryStats"],
        queryFn: fetchCloudinaryStats
    });

    const ringScale = useSharedValue(1);
    const ringStyle = useAnimatedStyle(() => ({
        transform: [{ scale: ringScale.value }]
    }));

    const onRingPress = () => {
        ringScale.value = withSpring(0.93, {}, () => {
            ringScale.value = withSpring(1);
        });
    };

    const used = stats.credits?.usage ?? 0;
    const limit = stats.credits?.limit ?? 25;
    const usedPercent = stats.credits?.used_percent ?? 0;

    const resetTime =
        stats.rate_limit_reset_at?.split("T").join(" ").substring(0, 16) ??
        "N/A";

    return (
        <View className="border border-border bg-card rounded-2xl px-4 py-5 gap-5">
            {/* Header */}
            <View className="flex-row items-center justify-between">
                <View>
                    <Text className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-0.5">
                        Cloud Storage
                    </Text>
                    <Text className="text-text text-lg font-black capitalize">
                        {stats.usage?.plan ?? "Free"} Plan
                    </Text>
                </View>
                <View className="border border-border rounded-xl px-3 py-1.5 bg-card-selected">
                    <Text className="text-text text-xs font-bold">
                        {stats?.resources ?? 0} files
                    </Text>
                </View>
            </View>

            {/* Divider */}
            <View className="h-px bg-border" />

            {/* Credit Ring */}
            <Pressable onPress={onRingPress}>
                <Animated.View style={ringStyle} className="items-center gap-2">
                    <CircularProgress
                        progress={usedPercent}
                        fraction={`${used}/${limit}`}
                        size={140}
                        strokeWidth={12}
                    />
                    <View className="items-center">
                        <Text className="text-text font-black text-base">
                            Credit Usage
                        </Text>
                        <Text className="text-text-secondary text-xs font-medium">
                            {usedPercent.toFixed(1)}% consumed
                        </Text>
                    </View>
                </Animated.View>
            </Pressable>

            {/* Divider */}
            <View className="h-px bg-border" />

            {/* Rate Limit Stats */}
            <View className="gap-1">
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-2">
                    Rate Limits
                </Text>
                <StatPill
                    label="Allowed"
                    value={stats.rate_limit_allowed ?? "—"}
                />
                <StatPill
                    label="Remaining"
                    value={stats.rate_limit_remaining ?? "—"}
                />
                <StatPill label="Resets at" value={resetTime} />
            </View>
        </View>
    );
};

const DB_METRICS = [
    { key: "reads", label: "Rows Read", icon: "📖" },
    { key: "writes", label: "Rows Written", icon: "✏️" },
    { key: "storage", label: "Storage", icon: "🗄️" }
];

const MetricRow = ({ label, icon, text, progress }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const onPress = () => {
        scale.value = withSpring(0.96, {}, () => {
            scale.value = withSpring(1);
        });
    };

    return (
        <Pressable onPress={onPress}>
            <Animated.View
                style={animatedStyle}
                className="border border-border bg-card rounded-xl px-4 py-3 gap-2"
            >
                {/* Label row */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                        <Text>{icon}</Text>
                        <Text className="text-text-secondary text-xs font-semibold uppercase tracking-widest">
                            {label}
                        </Text>
                    </View>
                    <Text className="text-text font-black text-sm">{text}</Text>
                </View>

                {/* Progress track */}
                <View className="h-1.5 bg-border rounded-full overflow-hidden">
                    <Animated.View
                        style={{ width: `${Math.min(progress * 100, 100)}%` }}
                        className="h-full bg-primary rounded-full"
                    />
                </View>
            </Animated.View>
        </Pressable>
    );
};

export const TursoStats = () => {
    const { data: stats = {} } = useQuery({
        queryKey: ["tursoStats", 10000],
        queryFn: fetchTursoStats
    });

    const { reads, writes, storage } = formatUsage({
        objects: { usage: stats.usage?.rows_read ?? 0 },
        requests: stats.usage?.rows_written ?? 0,
        storage: {
            usage: stats.usage?.storage_bytes ?? 0,
            limit_bytes: 5 * 1024 ** 3
        }
    });

    const metrics = { reads, writes, storage };

    return (
        <View className="border border-border bg-card rounded-2xl px-4 py-5 mt-5 gap-4">
            {/* Header */}
            <View className="flex-row items-center justify-between">
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-widest">
                    Database Storage
                </Text>
                <View className="border border-border rounded-xl px-3 py-1.5 bg-card-selected">
                    <Text className="text-text text-xs font-bold">Turso</Text>
                </View>
            </View>

            {/* Divider */}
            <View className="h-px bg-border" />

            {/* Metric rows */}
            <View className="gap-2">
                {DB_METRICS.map(m => (
                    <MetricRow
                        key={m.key}
                        label={m.label}
                        icon={m.icon}
                        text={metrics[m.key].text}
                        progress={metrics[m.key].progress}
                    />
                ))}
            </View>
        </View>
    );
};

const USER_ROLES = [
    { key: "teacher", label: "Teachers", icon: "🎓" },
    { key: "student", label: "Students", icon: "📚" },
    { key: "parent", label: "Parents", icon: "👨‍👩‍👧" },
    { key: "admin", label: "Admin", icon: "🛡️" }
];

const RoleCard = ({ label, icon, count }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const onPress = () => {
        scale.value = withSpring(0.94, {}, () => {
            scale.value = withSpring(1);
        });
    };

    return (
        <Pressable onPress={onPress} className="flex-1">
            <Animated.View
                style={animatedStyle}
                className="border border-border bg-card rounded-xl px-3 py-4 items-center gap-1"
            >
                <Text className="text-2xl">{icon}</Text>
                <Text className="text-text font-black text-xl">
                    {count ?? "—"}
                </Text>
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-widest">
                    {label}
                </Text>
            </Animated.View>
        </Pressable>
    );
};

export const UsersStats = () => {
    const { data: stats = {} } = useQuery({
        queryKey: ["userStats"],
        queryFn: fetchUserStats
    });

    const total = USER_ROLES.reduce(
        (sum, r) => sum + (stats[r.key]?.strength ?? 0),
        0
    );

    return (
        <View className="border border-border bg-card rounded-2xl px-4 py-5 mt-5 gap-4">
            {/* Header */}
            <View className="flex-row items-center justify-between">
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-widest">
                    Users
                </Text>
                <View className="border border-border rounded-xl px-3 py-1.5 bg-card-selected">
                    <Text className="text-text text-xs font-bold">
                        {total} total
                    </Text>
                </View>
            </View>

            {/* Divider */}
            <View className="h-px bg-border" />

            {/* 2×2 Grid */}
            <View className="gap-2">
                <View className="flex-row gap-2">
                    {USER_ROLES.slice(0, 2).map(r => (
                        <RoleCard
                            key={r.key}
                            label={r.label}
                            icon={r.icon}
                            count={stats[r.key]?.strength}
                        />
                    ))}
                </View>
                <View className="flex-row gap-2">
                    {USER_ROLES.slice(2).map(r => (
                        <RoleCard
                            key={r.key}
                            label={r.label}
                            icon={r.icon}
                            count={stats[r.key]?.strength}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};
