import { View, Text, Image, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { router } from "expo-router";

import Loader from "@components/common/Loader";
import Header from "@components/common/Header";
import {
    ItemSeparator,
    ListHeaderComponent
} from "@components/common/ItemSeperatorDateComponent";

import { fetchNotices } from "@controller/common/notice.controller.js";
import { formatDate, getTime } from "@utils/date.js";

const TARGET_LABEL = {
    all: "Everyone",
    teacher: "Teachers",
    student: "Students",
    parent: "Parents",
    class: "Class"
};

const NoticeCard = ({ item }) => {
    const handlePress = () => {
        router.push({
            pathname: "/common/notice/NoticeDetail",
            params: { notice: JSON.stringify(item) }
        });
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            className="bg-card rounded-2xl my-1 overflow-hidden">
            {item.image && (
                <Image
                    source={{ uri: item.image }}
                    style={{ width: "100%", height: 160 }}
                    resizeMode="cover"
                />
            )}

            <View className="px-4 py-4">
                <View className="flex-row items-center justify-between mb-1">
                    <View className="bg-card-selected px-3 py-1 rounded-full">
                        <Text className="text-xs font-bold text-blue-500">
                            {TARGET_LABEL[item.target] ?? item.target}
                            {item.yearCourse ? ` · ${item.yearCourse}` : ""}
                        </Text>
                    </View>
                    <Text className="text-text/50 text-xs font-semibold">
                        {getTime(item.createdAt)}
                    </Text>
                </View>

                <Text
                    className="text-text font-black text-lg mt-1"
                    numberOfLines={2}>
                    {item.title}
                </Text>

                {item.description ? (
                    <Text
                        className="text-text/70 font-medium text-sm mt-1"
                        numberOfLines={3}>
                        {item.description}
                    </Text>
                ) : null}
            </View>
        </TouchableOpacity>
    );
};

const NoticeHistory = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching
    } = useInfiniteQuery({
        queryKey: ["notices"],
        queryFn: ({ pageParam = 1 }) => fetchNotices(pageParam),
        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const notices = data?.pages?.flatMap(page => page?.notices ?? []) ?? [];

    return (
        <View className="flex-1 bg-primary">
            <Header title="Notices" />
            <FlashList
                data={notices}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <NoticeCard item={item} />}
                estimatedItemSize={200}
                className="px-2"
                contentContainerStyle={{ paddingTop: 72, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                onRefresh={refetch}
                refreshing={isRefetching}
                onEndReached={() => hasNextPage && fetchNextPage()}
                onEndReachedThreshold={0.4}
                ListHeaderComponent={
                    <ListHeaderComponent date={notices[0]?.createdAt} />
                }
                ItemSeparatorComponent={ItemSeparator}
                ListEmptyComponent={
                    !isLoading ? (
                        <Text className="text-lg font-bold text-text text-center mt-10">
                            No notices yet!
                        </Text>
                    ) : (
                        <Loader size="large" />
                    )
                }
                ListFooterComponent={
                    !isLoading && isFetchingNextPage ? (
                        <Loader size="large" />
                    ) : null
                }
            />
        </View>
    );
};

export default NoticeHistory;
