import { View, ActivityIndicator, Text } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";

import Header from "@components/common/Header.jsx";
import { AssignmentRenderItem } from "@components/student/Assignment.jsx";
import {
    ItemSeparator,
    ListHeaderComponent
} from "@components/common/ItemSeperatorDateComponent.jsx";

import { getAssignment } from "@controller/student/assignment.controller.js";

const Assignment = () => {
    const {
        data,
        fetchNextPage,
        isFetchNextPage,
        hasNextPage,
        refetch,
        isRefetching,
        isLoading
    } = useInfiniteQuery({
        queryKey: ["assignments"],
        queryFn: ({ pageParam = 1 }) =>
            getAssignment({
                pageParam
            }),
        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const assignments =
        data?.pages?.flatMap(page => page?.assignments ?? []) ?? [];

    return (
        <View className="flex-1 bg-primary">
            <Header title="Assignments" />

            <FlashList
                data={assignments}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <AssignmentRenderItem item={item} />}
                onEndReached={() => {
                    if (hasNextPage && !isFetchNextPage) fetchNextPage();
                }}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{
                    paddingBottom: 100
                }}
                className="px-1 pt-16"
                ListHeaderComponent={
                    !isLoading && (
                        <ListHeaderComponent
                            date={data?.pages?.[0]?.assignments?.[0]?.timestamp}
                        />
                    )
                }
                ListFooterComponent={
                    isFetchNextPage && (
                        <ActivityIndicator style={{ marginTop: 10 }} />
                    )
                }
                ListEmptyComponent={
                    isLoading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <Text className="text-text text-xl text-center font-bold mt-5">
                            No assignments yet!
                        </Text>
                    )
                }
                ItemSeparatorComponent={ItemSeparator}
                onRefresh={refetch}
                refreshing={isRefetching}
            />
        </View>
    );
};

export default Assignment;
