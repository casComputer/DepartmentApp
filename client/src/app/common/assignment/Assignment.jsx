import { View, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";

import Header from "@components/common/Header.jsx";
import FloatingAddButton from "@components/common/FloatingAddButton.jsx";
import { AssignmentRenderItem } from "@components/teacher/Assignment.jsx";
import {
    ItemSeparator,
    ListHeaderComponent
} from "@components/common/ItemSeperatorDateComponent.jsx";

import { getAssignment } from "@controller/teacher/assignment.controller.js";

import { formatDate } from "@utils/date.js";

const Assignment = () => {
    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        refetch,
        isRefetching,
        isLoading
    } = useInfiniteQuery({
        queryKey: ["assignments"],
        queryFn: ({ pageParam = 1 }) => getAssignment({ pageParam }),

        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const allItems = data?.pages.flatMap(page => page.assignments) || [];

    return (
        <View className="flex-1 bg-primary">
            <Header title="Assignments" />

            {isLoading && !isFetchNextPage && (
                <ActivityIndicator size={"large"} style={{ marginTop: 8 }} />
            )}

            <FlashList
                data={allItems || []}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <AssignmentRenderItem item={item} />}
                onEndReached={() => {
                    if (hasNextPage && !isFetchNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
                maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 100,
                    paddingTop: 16
                }}
                ListHeaderComponent={
                    <ListHeaderComponent date={allItems[0]?.timestamp} />
                }
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <ActivityIndicator size={"small"} />
                    ) : (
                        !hasNextPage &&
                        !isLoading &&
                        allItems?.length > 5 && (
                            <Text className="text-lg font-bold text-text text-center py-3">
                                Nothing else down here 👋
                            </Text>
                        )
                    )
                }
                ListEmptyComponent={
                    !isLoading && (
                        <Text className="font-bold text-text text-center text-lg">
                            Click + to create an assignment
                        </Text>
                    )
                }
                onRefresh={refetch}
                refreshing={isRefetching}
                ItemSeparatorComponent={ItemSeparator}
                showsVerticalScrollIndicator={false}
            />

            <FloatingAddButton
                onPress={() =>
                    router.push("/common/assignment/AssignmentCreation")
                }
            />
        </View>
    );
};

export default Assignment;
