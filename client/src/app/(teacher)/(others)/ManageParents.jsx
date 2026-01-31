import { View, Text, ActivityIndicator } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";

import Header from "@components/common/Header.jsx";
import { TeacherItem } from "@components/teacher/ManageParents.jsx";

import { fetchParents } from "@controller/teacher/parent.controller.js";

const iconSize = 18;

const ManageParents = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching
    } = useInfiniteQuery({
        queryKey: ["parents"],
        queryFn: ({ pageParam = 1 }) => fetchParents(pageParam),
        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const parents = data?.pages?.flatMap(page => page?.parents);

    console.log(data?.pages, parents);

    return (
        <View className="flex-1 bg-primary">
            <Header title={"Manage Parents"} />
            <FlashList
                data={parents ?? []}
                renderItem={({ item }) => <TeacherItem item={item} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.userId}
                contentContainerStyle={{
                    paddingTop: 10,
                    paddingBottom: 80
                }}
                ListEmptyComponent={
                    isLoading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <Text className="text-text text-lg font-bold text-center">
                            No parents registered yet!.
                        </Text>
                    )
                }
                endReachedThreshold={0.5}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                onRefresh={refetch}
                refreshing={isRefetching}
            />
        </View>
    );
};

export default ManageParents;
