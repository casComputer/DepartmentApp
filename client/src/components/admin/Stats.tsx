import { View, Text, Pressable} from "react-native";
import { useQuery } from "@tanstack/react-query"

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
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { useCSSVariable, useResolveClassNames } from "uniwind";
;

import ProgressBar from "@components/common/ProgressBar.jsx";
import CircularProgress from "@components/common/CircularProgress.jsx";

import {
    fetchCloudinaryStats,
    fetchTursoStats,
    fetchUserStats,
} from "@controller/admin/dashboard.controller.js";

import { formatUsage } from "@utils/formateTursoStats.js";

export const CloudinaryStats = () => {
    const { data: stats = {} } = useQuery({
        queryKey: ["cloudinaryStats"],
        queryFn: fetchCloudinaryStats,
    });

    return (
        <View className="border border-border px-3 bg-card py-5 rounded-2xl">
            <Text className="text-2xl font-black text-text-secondary">
                Cloud Storage
            </Text>
            <View className="pl-2 py-4">
                <Text className="text-md font-semibold text-text">
                    You are currently in a{" "}
                    <Text className="font-bold text-lg text-text uppercase">
                        {stats.usage?.plan ?? "Free "}
                    </Text>
                    plan.
                </Text>
                <Text className="text-md font-semibold text-text">
                    {stats?.resources} media files currently stored
                </Text>
                <View className="flex-1 items-center gap-3 my-4">
                    <CircularProgress
                        progress={stats.credits?.used_percent ?? 0}
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
        </View>
    );
};

export const TursoStats = () => {
    const { data: stats = {} } = useQuery({
        queryKey: ["tursoStats", 10000],
        queryFn: fetchTursoStats,
    });

    const { reads, writes, storage } = formatUsage({
        objects: { usage: stats.usage?.rows_read ?? 0 },
        requests: stats.usage?.rows_written ?? 0,
        storage: {
            usage: stats.usage?.storage_bytes ?? 0,
            limit_bytes: 5 * 1024 ** 3,
        }
        
    });

    return (
        <View className="border border-border px-3 bg-card py-5  rounded-2xl mt-5">
            <Text className="text-2xl font-black text-text-secondary">
                Database Storage
            </Text>
            <View className="pl-2 py-4 gap-1">
                <View className="flex-row items-center justify-between">
                    <Text className="text-md font-semibold text-text">
                        Rows Read
                    </Text>
                    <View className="flex-row items-center gap-2">
                        <Text
                            numberOfLines={1}
                            
                            className="text-md font-semibold text-text"
                        >
                            {reads.text}
                        </Text>
                        <ProgressBar progress={reads.progress} width={140} />
                    </View>
                </View>

                <View className="flex-row items-center justify-between">
                    <Text className="text-md font-semibold text-text">
                        Rows Written
                    </Text>
                    <View className="flex-row items-center gap-2">
                        <Text
                            numberOfLines={1}
                            
                            className="text-md font-semibold text-text"
                        >
                            {writes.text}
                        </Text>
                        <ProgressBar progress={writes.progress} width={140} />
                    </View>
                </View>

                <View className="flex-row items-center justify-between">
                    <Text className="text-md font-semibold text-text">
                        Storage Usage
                    </Text>
                    <View className="flex-row items-center gap-2 justify-end">
                        <Text
                            numberOfLines={1}
                            
                            className="text-md font-semibold text-text"
                        >
                            {storage.text}
                        </Text>
                        <ProgressBar
                            progress={storage.progress}
                            width={140}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};


// ─── Animated SVG Circle ─────────────────────────────────────────────────────

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ─── Circular Progress ───────────────────────────────────────────────────────

const ArcGauge = ({
    progress,
    fraction,
    size = 140,
    strokeWidth = 12,
}: {
    progress: number;
    fraction: string;
    size?: number;
    strokeWidth?: number;
}) => {
    const primaryColor = useCSSVariable("--color-primary") as string;
    const borderColor  = useCSSVariable("--color-border")  as string;

    const r           = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * r;
    const cx          = size / 2;
    const cy          = size / 2;

    // Animate strokeDashoffset from full circle → actual progress
    const animProg = useSharedValue(0);
    useEffect(() => {
        animProg.value = withTiming(progress / 100, {
            duration: 1200,
            easing: Easing.out(Easing.cubic),
        });
    }, [progress]);

    // Pulse glow on the tracker dot
    const pulse = useSharedValue(1);
    useEffect(() => {
        pulse.value = withRepeat(
            withSequence(
                withTiming(1.4, { duration: 900, easing: Easing.inOut(Easing.sine) }),
                withTiming(1.0, { duration: 900, easing: Easing.inOut(Easing.sine) })
            ),
            -1,
            false
        );
    }, []);

    const arcStyle = useAnimatedStyle(() => ({
        strokeDashoffset: interpolate(
            animProg.value,
            [0, 1],
            [circumference, 0]
        ),
    }));

    const dotOpacity = useAnimatedStyle(() => ({
        opacity: interpolate(pulse.value, [1, 1.4], [0.6, 1]),
        transform: [{ scale: pulse.value }],
    }));

    // Derive percent label
    const percentStyle = useResolveClassNames("text-text font-black");
    const subStyle     = useResolveClassNames("text-text-secondary text-xs font-semibold tracking-widest uppercase");

    return (
        <View style={{ alignItems: "center", justifyContent: "center", width: size, height: size }}>
            <Svg width={size} height={size} style={{ position: "absolute" }}>
                <Defs>
                    <LinearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor={primaryColor} stopOpacity="0.5" />
                        <Stop offset="100%" stopColor={primaryColor} stopOpacity="1" />
                    </LinearGradient>
                </Defs>

                {/* Track */}
                <Circle
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={borderColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Progress arc */}
                <AnimatedCircle
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke="url(#arcGrad)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animatedProps={arcStyle}
                    rotation="-90"
                    origin={`${cx}, ${cy}`}
                />
            </Svg>

            {/* Pulsing center dot */}
            <Animated.View
                style={[
                    {
                        position: "absolute",
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: primaryColor,
                        bottom: cy - 4 - strokeWidth / 2 + 2,
                    },
                    dotOpacity,
                ]}
            />

            {/* Center text */}
            <View style={{ alignItems: "center" }}>
                <Animated.Text style={[percentStyle, { fontSize: 28, lineHeight: 30 }]}>
                    {Math.round(progress)}%
                </Animated.Text>
                <Animated.Text style={subStyle}>{fraction}</Animated.Text>
            </View>
        </View>
    );
};

// ─── Stat Row ─────────────────────────────────────────────────────────────────

const StatRow = ({
    label,
    value,
    accent = false,
}: {
    label: string;
    value: string | number;
    accent?: boolean;
}) => {
    const primaryColor = useCSSVariable("--color-primary") as string;

    const pressed  = useSharedValue(0);
    const rowStyle = useResolveClassNames("flex-row justify-between items-center py-3");
    const labelCls = useResolveClassNames("text-xs font-bold uppercase tracking-widest text-text-secondary");
    const valueCls = useResolveClassNames(
        accent ? "text-sm font-black text-primary" : "text-sm font-bold text-text"
    );

    const animStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            pressed.value,
            [0, 1],
            ["transparent", primaryColor + "12"]
        ),
        transform: [{ translateX: interpolate(pressed.value, [0, 1], [0, 4]) }],
        borderRadius: 10,
        paddingHorizontal: 8,
    }));

    return (
        <Pressable
            onPressIn={() => {
                pressed.value = withTiming(1, { duration: 120 });
            }}
            onPressOut={() => {
                pressed.value = withSpring(0, { damping: 14 });
            }}
        >
            <Animated.View style={[rowStyle, animStyle]}>
                <Animated.Text style={labelCls}>{label}</Animated.Text>
                <Animated.Text style={valueCls}>{value || "—"}</Animated.Text>
            </Animated.View>
        </Pressable>
    );
};

// ─── Divider ──────────────────────────────────────────────────────────────────

const Divider = () => {
    const s = useResolveClassNames("bg-border");
    return <View style={[s, { height: 1, marginVertical: 2 }]} />;
};

// ─── Plan Badge ───────────────────────────────────────────────────────────────

const PlanBadge = ({ plan }: { plan: string }) => {
    const glow  = useSharedValue(0);
    const primaryColor = useCSSVariable("--color-primary") as string;

    useEffect(() => {
        glow.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sine) }),
                withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sine) })
            ),
            -1,
            false
        );
    }, []);

    const badgeAnim = useAnimatedStyle(() => ({
        shadowColor: primaryColor,
        shadowOpacity: interpolate(glow.value, [0, 1], [0.08, 0.35]),
        shadowRadius: interpolate(glow.value, [0, 1], [4, 14]),
        shadowOffset: { width: 0, height: 0 },
        elevation: interpolate(glow.value, [0, 1], [2, 8]),
    }));

    const badgeBase = useResolveClassNames(
        "bg-card-selected border border-primary px-4 py-1 rounded-full"
    );
    const badgeText = useResolveClassNames(
        "text-xs font-black uppercase tracking-widest text-primary"
    );

    return (
        <Animated.View style={[badgeBase, badgeAnim]}>
            <Animated.Text style={badgeText}>{plan || "Free"}</Animated.Text>
        </Animated.View>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const CloudinaryStats = () => {
    const { data: stats = {} } = useQuery({
        queryKey: ["cloudinaryStats"],
        queryFn: fetchCloudinaryStats,
    });

    // Header press ripple
    const headerPress = useSharedValue(0);
    const primaryColor = useCSSVariable("--color-primary") as string;

    const cardCls    = useResolveClassNames("bg-card border border-border rounded-3xl overflow-hidden");
    const titleCls   = useResolveClassNames("text-xl font-black uppercase tracking-widest text-text");
    const subTitleCls= useResolveClassNames("text-xs font-semibold tracking-widest uppercase text-text-secondary");
    const mediaCls   = useResolveClassNames("text-3xl font-black text-text");
    const mediaSubCls= useResolveClassNames("text-xs uppercase tracking-widest font-bold text-text-secondary");

    // Thin accent line at top animates width on mount → driven by data
    const accentAnim = useSharedValue(0);
    useEffect(() => {
        accentAnim.value = withTiming(1, {
            duration: 900,
            easing: Easing.out(Easing.cubic),
        });
    }, []);

    const accentStyle = useAnimatedStyle(() => ({
        width: `${interpolate(accentAnim.value, [0, 1], [0, 100])}%`,
    }));

    const headerBg = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            headerPress.value,
            [0, 1],
            ["transparent", primaryColor + "0D"]
        ),
    }));

    const resetTime = stats.rate_limit_reset_at
        ?.split("T")
        .join("  ")
        .substring(0, 16) || "N/A";

    const usedPercent = stats.credits?.used_percent ?? 0;
    const fraction    = `${stats.credits?.usage ?? 0} / ${stats.credits?.limit ?? 25}`;

    return (
        <View style={[cardCls]}>

            {/* Top accent bar — data-driven width */}
            <View style={{ height: 3, backgroundColor: primaryColor + "22" }}>
                <Animated.View
                    style={[
                        accentStyle,
                        { height: "100%", backgroundColor: primaryColor },
                    ]}
                />
            </View>

            {/* Header */}
            <Pressable
                onPressIn={() => { headerPress.value = withTiming(1, { duration: 100 }); }}
                onPressOut={() => { headerPress.value = withSpring(0, { damping: 12 }); }}
            >
                <Animated.View style={[headerBg, { padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
                    <View>
                        <Animated.Text style={subTitleCls}>Dashboard</Animated.Text>
                        <Animated.Text style={titleCls}>Cloud Storage</Animated.Text>
                    </View>
                    <PlanBadge plan={stats.usage?.plan} />
                </Animated.View>
            </Pressable>

            <View style={{ height: 1, backgroundColor: primaryColor + "18" }} />

            {/* Media count + Gauge — side by side */}
            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 20, gap: 16 }}>
                {/* Left: media count */}
                <View style={{ flex: 1, gap: 4 }}>
                    <Animated.Text style={mediaSubCls}>Files Stored</Animated.Text>
                    <Animated.Text style={mediaCls}>
                        {stats?.resources ?? 0}
                    </Animated.Text>
                    <Animated.Text style={[subTitleCls, { marginTop: 12 }]}>Credit Usage</Animated.Text>
                    <Animated.Text style={[mediaCls, { fontSize: 14, lineHeight: 18 }]}>
                        {stats.credits?.usage ?? 0}
                        <Animated.Text style={[subTitleCls, { fontSize: 12 }]}>
                            {" "}/ {stats.credits?.limit ?? 25}
                        </Animated.Text>
                    </Animated.Text>
                </View>

                {/* Right: arc gauge */}
                <ArcGauge
                    progress={usedPercent}
                    fraction={fraction}
                    size={150}
                    strokeWidth={13}
                />
            </View>

            <View style={{ marginHorizontal: 20, height: 1, backgroundColor: primaryColor + "18" }} />

            {/* Rate limit stats */}
            <View style={{ paddingHorizontal: 12, paddingVertical: 8, paddingBottom: 16 }}>
                <StatRow label="Rate Limit"     value={stats.rate_limit_allowed}   />
                <Divider />
                <StatRow label="Remaining"      value={stats.rate_limit_remaining} accent />
                <Divider />
                <StatRow label="Resets At"      value={resetTime}                  />
            </View>

        </View>
    );
};

