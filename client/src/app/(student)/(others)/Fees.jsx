import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";

import Header from "@components/common/Header.jsx";
import {
    ItemSeparator,
    ListHeaderComponent
} from "@components/common/ItemSeperatorDateComponent.jsx";

import { fetch as fetchFees } from "@controller/student/fees.controller.js";

import { formatDate, isDatePassed, getRemainingDays } from "@utils/date.js";

const RenderItem = ({ item }) => {
    const remainingDays = getRemainingDays(item?.dueDate);

    return (
        <View
            style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
            className="px-3 py-6 mt-2 bg-card rounded-3xl gap-2 border border-border"
        >
            <Text className="text-text text-lg font-bold">{item?.details}</Text>
            <Text className="text-text text-xl font-bold">
                {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR"
                }).format(item.amount)}
            </Text>
            <View className="flex-row justify-between items-center">
                <Text
                    className={`${
                        isDatePassed(item.dueDate)
                            ? "text-red-500"
                            : "text-text"
                    } text-md font-bold mt-2`}
                >
                    Due date: {formatDate(item?.dueDate)}
                </Text>
                {remainingDays >= 0 ? (
                    <Text className="text-text text-sm font-bold">
                        {remainingDays} days remaining.
                    </Text>
                ) : (
                    <Text className="text-red-500 text-sm font-bold">
                        Overdue by {Math.abs(remainingDays)} day
                        {Math.abs(remainingDays) !== 1 && "s"}
                    </Text>
                )}
            </View>
            <Text className="text-text text-sm font-bold">
                Created on {formatDate(item?.timestamp)}
            </Text>
        </View>
    );
};

const History = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching
    } = useInfiniteQuery({
        queryKey: ["fees"],
        queryFn: ({ pageParam = 1 }) => fetchFees(pageParam),
        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const fees = data?.pages?.flatMap(page => page?.fees ?? []) ?? [];

    return (
        <View className="flex-1 bg-primary">
            <Header title={"Fee History"} />
            <FlashList
                data={fees}
                ListEmptyComponent={
                    !isLoading && (
                        <Text className="text-lg font-bold text-text text-center mt-5">
                            No fees history Found!
                        </Text>
                    )
                }
                ListFooterComponent={
                    !isLoading &&
                    isFetchingNextPage && <ActivityIndicator size={"large"} />
                }
                renderItem={({ item }) => <RenderItem item={item} />}
                contentContainerStyle={{ paddingBottom: 100 }}
                className="px-1 pt-16"
                onRefresh={refetch}
                refreshing={isRefetching}
                ListHeaderComponent={
                    isLoading && !isRefetching ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <ListHeaderComponent date={fees?.[0]?.timestamp} />
                    )
                }
                ItemSeparatorComponent={ItemSeparator}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default History;
