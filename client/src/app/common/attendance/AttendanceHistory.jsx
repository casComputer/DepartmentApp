import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIndicator, View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";

import Header from "@components/common/Header";
import { AttendanceHistoryRenderItem } from "@components/teacher/Attendance.jsx";
import {
    ItemSeparator,
    ListHeaderComponent
} from "@components/common/ItemSeperatorDateComponent.jsx";

import { getAttendanceHistoryByTeacherId } from "@controller/teacher/attendance.controller.js";

const AttendanceHistory = () => {
    const limit = 20;

    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching
    } = useInfiniteQuery({
        queryKey: ["attendanceHistory"],
        queryFn: ({ pageParam = 1 }) =>
            getAttendanceHistoryByTeacherId({ pageParam, limit }),
        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const allItems = data?.pages?.flatMap(page => page.data);

    return (
        <View className="flex-1 bg-primary">
            <Header title="History" isAbsolute={true} />
            <FlashList
                data={allItems}
                renderItem={({ item }) => (
                    <AttendanceHistoryRenderItem item={item} />
                )}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{
                    paddingBottom: 60
                }}
                ListEmptyComponent={
                    isLoading ? (
                        <ActivityIndicator size={"large"} />
                    ) : (
                        <Text className="text-text text-lg font-bold text-center mt-5">
                            No attendance history found!
                        </Text>
                    )
                }
                ItemSeparatorComponent={ItemSeparator}
                ListHeaderComponent={
                    <ListHeaderComponent date={allItems?.[0]?.timestamp} />
                }
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <ActivityIndicator size={"large"} />
                    ) : (
                        !hasNextPage &&
                        !isLoading &&
                        allItems?.length > 8 && (
                            <Text className="text-lg font-bold text-text text-center py-3">
                                Nothing else down here 👋
                            </Text>
                        )
                    )
                }
                onRefresh={refetch}
                refreshing={isRefetching}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default AttendanceHistory;
