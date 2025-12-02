import { useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { withUniwind } from "uniwind";

import Header from "@components/common/Header.jsx";

import { fetchWorklogs } from "@controller/teacher/worklog.controller";

const StyledActivityIndicator = withUniwind(ActivityIndicator);

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
                <Text className="text-lg font-black dark:text-white">
                    {new Date(item.date).toLocaleDateString()} {"\n"}
                    {item.year} {item.course} {"\n"}
                    {item.hour} Hour
                </Text>
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
    // const {
    //     data: worklogs = [],
    //     isLoading,
    //     isError
    // } = useQuery({
    //     queryKey: ["worklogs"],
    //     queryFn: fetchWorklogs
    // });

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
                // keyExtractor={item => item.id}
                renderItem={({ item }) => <RenderItem item={item} />}
                endReachedThreshold={0.5}
                onEndReached={() => {
                    // if (hasNextPage) fetchNextPage();
                }}
                contentContainerStyle={{
                    paddingBottom: 20,
                    paddingHorizontal: 5
                }}
                ListFooterComponent={
                    isFetchingNextPage ? <ActivityIndicator /> : null
                }
            />
        </View>
    );
};

export default WorkLogHistory;
