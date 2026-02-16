import { View, Text, FlatList, Dimensions, Image } from "react-native";

const CARD_WIDTH = 300;
const SPACING = 16;
const SCREEN_WIDTH = Dimensions.get("window").width;

const topperDecorations = ["👒", "🎗️", "🎊", "🥇", "🎖️"];
const topperDecoration =
    topperDecorations[Math.floor(Math.random() * topperDecorations.length)] ??
    "🥇";

const Item = ({ item }) => {
    if (!item?.studentId) return null;

    return (
        <View
            style={{
                width: CARD_WIDTH,
                marginRight: SPACING
            }}
            className="bg-card border border-border items-center justify-center rounded-3xl py-6"
        >
            <View
                className={`w-[100px] h-[100px] rounded-full bg-card-selected items-center justify-center`}
            >
                {item.dp ? (
                    <Image
                        source={{ uri: item.dp }}
                        resizeMode="cover"
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: SCREEN_WIDTH
                        }}
                    />
                ) : (
                    <Text className="text-text text-3xl font-bold text-center">
                        {item.studentId.slice(0, 1)}
                    </Text>
                )}
                <Text className="text-text text-3xl font-bold absolute top-1 right-0 rotate-12">
                    {item.rank === 1
                        ? topperDecoration
                        : item.rank === 2
                          ? "🥈"
                          : "🥉"}
                </Text>
            </View>
            <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                className="text-center text-text text-3xl font-bold w-full"
            >
                {item.studentId}
            </Text>
            <Text className="text-text-secondary text-xl font-bold">
                {item.percentage}%
            </Text>
        </View>
    );
};

export const AttendanceLeaderBoard = ({ comparison }) => {
    const topPerformers =
        [
            comparison?.topPerformers[1],
            comparison?.topPerformers[0],
            comparison?.topPerformers[2]
        ] ?? [];

    return (
        <View className="w-full pt-4">
            <Text className="text-text text-2xl font-bold px-3 mb-4">
                Attendance Champions 🏆
            </Text>

            <FlatList
                horizontal
                data={topPerformers ?? []}
                keyExtractor={item => item?.studentId ?? item?.toString()}
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={1}
                getItemLayout={(_, index) => ({
                    length: CARD_WIDTH + SPACING,
                    offset: (CARD_WIDTH + SPACING) * index,
                    index
                })}
                snapToInterval={CARD_WIDTH + SPACING}
                decelerationRate="fast"
                contentContainerStyle={{
                    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2
                }}
                renderItem={({ item }) => <Item item={item} />}
            />
            <Text className="text-text-secondary text-lg font-bold text-center mt-3">
                Your Rank: {comparison?.yourRank}
            </Text>
            <Text className="text-text-secondary text-md font-bold text-center mt-1">
                Class Average: {comparison?.classAverage}
            </Text>
        </View>
    );
};

export default AttendanceLeaderBoard;
