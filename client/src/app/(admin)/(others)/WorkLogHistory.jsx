import { useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";

import Header from "@components/common/Header.jsx";

import { fetchWorklogs } from "@controller/teacher/worklog.controller";

const showDate = date => {
    const formatted = new Date(date).toLocaleDateString();
    const today = new Date();
    if (formatted === today.toLocaleDateString()) return "Today";
    const yes = new Date(today.setDate(today.getDate() - 1));
    if (formatted === yes.toLocaleDateString()) return "Yesterday";
    return formatted;
};

const RenderItem = ({ item }) => {
    const [showFullTopics, setShowFullTopics] = useState(false);

    return (
        <View
            style={{
                boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.5)"
            }}
            className="bg-white m-2 p-4 rounded-3xl dark:bg-zinc-900">
            <View className="flex-row justify-between items-center mb-2">
                <Text
                    numberOfLines={2}
                    className="text-lg font-black dark:text-white">
                    Subject: {"\n\t"}
                    {item.subject}
                </Text>
                <View className="items-end">
                    <Text className="text-lg font-black dark:text-white">
                        {showDate(item.date)}
                    </Text>
                    <Text className="text-lg font-black dark:text-white">
                        {item.year} {item.course}
                    </Text>
                    <Text className="text-lg font-black dark:text-white">
                        {item.hour} Hour
                    </Text>
                </View>
            </View>

            <Text className="text-xl font-black mt-5 dark:text-white">
                Topics:
            </Text>

            <Text
                numberOfLines={showFullTopics ? undefined : 1}
                className="text-xl pl-3 dark:text-white max-w-[90%]">
                {item.topics}
            </Text>
            <Pressable onPress={() => setShowFullTopics(prev => !prev)}>
                <Text className="text-sm pl-3 font-bold text-blue-400">
                    {showFullTopics ? "less" : "more"}
                </Text>
            </Pressable>
        </View>
    );
};

const WorkLogHistory = () => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["worklogs"],
            queryFn: ({ pageParam = 1 }) => fetchWorklogs(pageParam),
            getNextPageParam: lastPage =>
                lastPage.hasMore ? lastPage.nextPage : undefined
        });

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <Header title={"History"} />

            <FlashList
                data={data?.pages?.flatMap(page => page?.data)}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <RenderItem item={item} />}
                endReachedThreshold={0.5}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                contentContainerStyle={{
                    paddingBottom: 60,
                    paddingHorizontal: 5
                }}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <ActivityIndicator size="large" />
                    ) : null
                }
            />
        </View>
    );
};

export default WorkLogHistory;
