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

    const allItems = data?.pages?.flatMap(page => page?.data);

    return (
        <View className="flex-1 bg-primary">
            <Header title={"History"} />

            {isLoading && !isFetchingNextPage && (
                <ActivityIndicator size="large" />
            )}

            <FlashList
                data={allItems}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <HistoryRenderItem item={item} />}
                endReachedThreshold={0.5}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 60,
                    paddingTop: 10,
                    paddingHorizontal: 5
                }}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        !hasNextPage &&
                        allItems?.length > 8 && (
                            <Text className="text-lg font-bold text-text text-center py-3">
                                Nothing else down here 👋
                            </Text>
                        )
                    )
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
