import { useState } from "react";
import { View, Text, Image,ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";

import Header from "@components/common/Header.jsx";
import Select from "@components/common/Select.jsx";

import getPreviewUrl from "@utils/pdfPreview.js";

import { fetchInternal } from "@controller/student/internal.controller.js";

const RenderItem = ({ item = {} }) => {
    const uri = getPreviewUrl(item.secure_url);
    return (
        <View
            style={{ boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.5)" }}
            className="px-3 py-6 mt-2 bg-card rounded-3xl gap-2"
        >
            <Text className="text-text text-lg font-bold">{item.filename}</Text>
            <Text className="text-text text-xl font-bold">
                {item.teacherId}
            </Text>
            <View className="w-24 h-24 rounded-2xl overflow-hidden bg-card">
                <Image
                    source={{ uri }}
                    style={{ width: "100%", height: "100%" }}
                />
            </View>
            <Text className="text-text text-sm font-bold">
                Created on {formatDate(item.createdAt)}
            </Text>
        </View>
    );
};

const InternalMark = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching
    } = useInfiniteQuery({
        queryKey: ["internal"],
        queryFn: ({ pageParam = 1 }) => fetchInternal(pageParam),
        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const internal = data?.pages?.flatMap(page => page.internal);
    
    console.log(internal, data);

    return (
        <View className="flex-1 bg-primary">
            <Header title={"Internals"} />
            <FlashList
                data={internal}
                ListEmptyComponent={
                    !isLoading ? (
                        <Text className="text-lg font-bold text-text text-center mt-5">
                            No Internals Found!
                        </Text>
                    ) : (
                        <ActivityIndicator size="large" />
                    )
                }
                ListFooterComponent={
                    !isLoading &&
                    isFetchingNextPage && <ActivityIndicator size={"large"} />
                }
                renderItem={({ item }) => <RenderItem item={item} />}
                contentContainerStyle={{ paddingBottom: 100 }}
                className="px-2"
                onRefresh={refetch}
                refreshing={isRefetching}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default InternalMark;
