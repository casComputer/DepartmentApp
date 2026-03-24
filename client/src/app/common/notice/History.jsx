import { View, Text, Image, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import Loader from "@components/common/Loader";
import Header from "@components/common/Header";
import FloatingAddButton from "@components/common/FloatingAddButton";
import {
    ItemSeparator,
    ListHeaderComponent
} from "@components/common/ItemSeperatorDateComponent";

import { fetchNotices } from "@controller/common/notice.controller.js";
import { deleteNotice } from "@controller/admin/notice.controller.js";
import { formatDate, getTime } from "@utils/date.js";
import showConfirm from "@utils/confirm.js";
import { useAppStore } from "@store/app.store.js";

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
            pathname: "/common/notice/Details",
            params: { notice: JSON.stringify(item) }
        });
    };

    const handleDelete = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        showConfirm("Are sure to delete this item ?", () => {
            deleteNotice(item._id);
        });
    };

    const role = useAppStore(state => state.user.role);

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

                <TouchableOpacity className="self-end" onPress={handleDelete}>
                    <MaterialIcons name="delete" size={24} color="#f73737" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const NoticeHistory = ({ isTab = false }) => {
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

    const role = useAppStore(state => state.user.role);

    return (
        <View className="flex-1 bg-primary">
            {!isTab && <Header title="Notices" />}
            <FlashList
                data={notices}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <NoticeCard item={item} />}
                estimatedItemSize={200}
                className="px-2"
                contentContainerStyle={{
                    paddingBottom: 120,
                    paddingTop: isTab ? 0 : 70
                }}
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
            {role === "admin" && (
                <FloatingAddButton
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push("/(admin)/(others)/SendNotice");
                    }}
                />
            )}
        </View>
    );
};

export default NoticeHistory;
