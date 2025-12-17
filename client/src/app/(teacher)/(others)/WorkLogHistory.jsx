import { useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";

import Header from "@components/common/Header.jsx";
import { HistoryRenderItem } from "@components/teacher/WorkLog.jsx";
import {
    ItemSeparator,
    ListHeaderComponent
} from "@components/common/ItemSeperatorDateComponent.jsx";

import { fetchWorklogs } from "@controller/teacher/worklog.controller";

const WorkLogHistory = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching
    } = useInfiniteQuery({
        queryKey: ["worklogs"],
        queryFn: ({ pageParam = 1 }) => fetchWorklogs(pageParam),
        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });

    return (
        <View className="flex-1 bg-primary">
            <Header title={"History"} />

            {isLoading && !isFetchingNextPage && (
                <ActivityIndicator size="large" />
            )}

            <FlashList
                data={data?.pages?.flatMap(page => page?.data)}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <HistoryRenderItem item={item} />}
                endReachedThreshold={0.5}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                contentContainerStyle={{
                    paddingBottom: 60,
                    paddingTop: 40,
                    paddingHorizontal: 5
                }}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <ActivityIndicator size="large" />
                    ) : null
                }
                ItemSeparatorComponent={ItemSeparator}
                ListHeaderComponent={
                    <ListHeaderComponent
                        date={data?.pages?.[0]?.data?.[0]?.date}
                    />
                }
                onRefresh={refetch}
                refreshing={isRefetching}
            />
        </View>
    );
};

export default WorkLogHistory;
