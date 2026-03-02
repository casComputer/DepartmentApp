import { View, Text, FlatList, Dimensions, Image } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const CARD_WIDTH = 260;
const SPACING = 12;
const SCREEN_WIDTH = Dimensions.get("window").width;

const topperDecorations = ["👒", "🎗️", "🎊", "🥇", "🎖️"];
const topperDecoration =
    topperDecorations[Math.floor(Math.random() * topperDecorations.length)] ?? "🥇";

// Rank config — 1st is taller to create podium effect
const RANK_CONFIG = {
    1: { height: 130, avatarSize: 100, decoration: topperDecoration },
    2: { height: 110, avatarSize: 84,  decoration: "🥈" },
    3: { height: 110, avatarSize: 84,  decoration: "🥉" },
};

const Item = ({ item }) => {
    if (!item?.studentId) return null;

    const cfg = RANK_CONFIG[item.rank] ?? RANK_CONFIG[3];

    return (
        <View
            style={{ width: CARD_WIDTH, marginRight: SPACING }}
            className="bg-card border border-border items-center justify-center rounded-3xl py-5 gap-2"
        >
            {/* Rank badge */}
            <View className="absolute top-3 left-4">
                <View className="bg-card-selected rounded-full px-2.5 py-1">
                    <Text className="text-text-secondary text-xs font-black tracking-widest">
                        #{item.rank}
                    </Text>
                </View>
            </View>

            {/* Avatar */}
            <View
                style={{ width: cfg.avatarSize, height: cfg.avatarSize }}
                className="rounded-full bg-card-selected items-center justify-center overflow-hidden"
            >
                {item.dp ? (
                    <Image
                        source={{ uri: item.dp }}
                        resizeMode="cover"
                        style={{ width: "100%", height: "100%", borderRadius: SCREEN_WIDTH }}
                    />
                ) : (
                    <Text className="text-text text-3xl font-bold text-center">
                        {item.studentId.slice(0, 1)}
                    </Text>
                )}
            </View>

            {/* Decoration emoji — outside avatar, not overlapping */}
            <Text style={{ fontSize: 28, lineHeight: 32 }}>{cfg.decoration}</Text>

            {/* Name */}
            <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                className="text-center text-text text-xl font-black w-full px-4"
            >
                {item.studentId}
            </Text>

            {/* Percentage pill */}
            <View className="bg-card-selected rounded-full px-4 py-1">
                <Text className="text-text-secondary text-base font-black">
                    {item.percentage}%
                </Text>
            </View>
        </View>
    );
};

export const AttendanceLeaderBoard = ({ comparison }) => {
    const topPerformers = [
        comparison?.topPerformers?.[1],
        comparison?.topPerformers?.[0],
        comparison?.topPerformers?.[2],
    ];

    return (
        <View className="w-full pt-4">
            {/* Header */}
            <View className="px-4 mb-4 gap-0.5">
                <Text className="text-text-secondary text-xs font-bold tracking-widest uppercase">
                    Leaderboard
                </Text>
                <Text className="text-text text-2xl font-black">
                    Attendance Champions 🏆
                </Text>
            </View>

            <FlatList
                horizontal
                data={topPerformers ?? []}
                keyExtractor={item => item?.studentId ?? Math.random().toString()}
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={1}
                getItemLayout={(_, index) => ({
                    length: CARD_WIDTH + SPACING,
                    offset: (CARD_WIDTH + SPACING) * index,
                    index,
                })}
                snapToInterval={CARD_WIDTH + SPACING}
                decelerationRate="fast"
                contentContainerStyle={{
                    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
                }}
                renderItem={({ item }) => <Item item={item} />}
            />

            {/* Your rank + class average */}
            <View className="flex-row mx-4 mt-4 gap-3">
                <View className="flex-1 bg-card border border-border rounded-2xl py-3 items-center gap-0.5">
                    <Text className="text-text-secondary text-xs font-bold tracking-widest uppercase">
                        Your Rank
                    </Text>
                    <Text className="text-text text-2xl font-black">
                        #{comparison?.yourRank ?? "—"}
                    </Text>
                </View>
                <View className="flex-1 bg-card border border-border rounded-2xl py-3 items-center gap-0.5">
                    <Text className="text-text-secondary text-xs font-bold tracking-widest uppercase">
                        Class Avg
                    </Text>
                    <Text className="text-text text-2xl font-black">
                        {comparison?.classAverage ?? "—"}%
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default AttendanceLeaderBoard;
