import React from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import Header from "@components/common/Header.jsx";
import Loader from "@components/common/Loader";

import {
    fetch as fetchFees,
    deleteFee
} from "@controller/teacher/fees.controller.js";

import { formatDate, isDatePassed } from "@utils/date.js";

const RenderItem = ({ item }) => {
    const handleDelete = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this item?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        deleteFee(item.feeId);
                    },
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    return (
        <View
            style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
            className="px-3 py-6 mt-2 bg-card rounded-3xl gap-2"
        >
            <View className="w-full flex-row items-start justify-between">
                <Text className="text-text text-lg font-bold w-[80%]">
                    {item?.details}
                </Text>
                <TouchableOpacity onPress={handleDelete}>
                    <MaterialIcons name="delete" size={24} color="#f95151" />
                </TouchableOpacity>
            </View>
            <Text className="text-text text-xl font-bold">
                Amount: {item?.amount}
            </Text>
            <Text
                className={`${
                    isDatePassed(item.dueDate) ? "text-red-500" : "text-text"
                } text-md font-bold mt-2`}
            >
                Due date: {formatDate(item?.dueDate)}
            </Text>
            <Text className="text-text text-sm font-bold">
                Created on {formatDate(item?.timestamp ?? item.createdAt)}
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
                    !isLoading ? (
                        <Text className="text-lg font-bold text-text text-center mt-5">
                            No fees history Found!
                        </Text>
                    ) : (
                        <Loader size="large" />
                    )
                }
                ListFooterComponent={
                    !isLoading && isFetchingNextPage && <Loader />
                }
                renderItem={({ item }) => <RenderItem item={item} />}
                contentContainerStyle={{ paddingBottom: 100 }}
                className="px-2 pt-16"
                onRefresh={refetch}
                refreshing={isRefetching}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default History;
