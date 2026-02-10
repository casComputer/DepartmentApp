import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";

import Header from "@components/common/Header";
import { fetchNotifications } from "@controller/common/notification.controller.js";

const RenderItem = ({ item = {} }) => {
    console.log(item);
    const data = JSON.parse(item.data ?? "{}");

    return (
        <TouchableOpacity className="flex-row bg-card my-1 px-3">
            <Text className="text-text font-black text-xl">{item.title}</Text>
        </TouchableOpacity>
    );
};

const NotificationList = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching
    } = useInfiniteQuery({
        queryKey: ["notifications"],
        queryFn: ({ pageParam = 1 }) => fetchNotifications(pageParam),
        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const notifications =
        data?.pages?.flatMap(page => page.notifications) ?? [];

    return (
        <View className="flex-1 bg-primary">
            <Header title="Notifications" />
            <FlashList
                data={notifications ?? []}
                ListEmptyComponent={
                    !isLoading && (
                        <Text className="text-lg font-bold text-text text-center mt-5">
                            No Notifications Yet!
                        </Text>
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

export default NotificationList;
