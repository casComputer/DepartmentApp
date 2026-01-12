import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIndicator, View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";

import Header from "@components/common/Header";
import { AttendanceHistoryRenderItem } from "@components/teacher/Attendance.jsx";
import {
    ItemSeparator,
    ListHeaderComponent
} from "@components/common/ItemSeperatorDateComponent.jsx";

import { getClassAttendance } from "@controller/teacher/attendance.controller.js";

const AttendanceClassHistory = () => {
    const limit = 20;
    const { year, course } = useLocalSearchParams();

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching
    } = useInfiniteQuery({
        queryKey: ["AttendanceClassHistory", course, year],
        queryFn: ({ pageParam = 1 }) =>
            getClassAttendance({ pageParam, limit, course, year }),
        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const allItems = data?.pages?.flatMap(page => page.attendance);

    return (
        <View className="flex-1 bg-primary">
            <Header title="Class History" isAbsolute={true} />
            <FlashList
                data={allItems}
                renderItem={({ item }) => (
                    <AttendanceHistoryRenderItem
                        item={item}
                        haveFullAccess={true}
                    />
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

export default AttendanceClassHistory;
