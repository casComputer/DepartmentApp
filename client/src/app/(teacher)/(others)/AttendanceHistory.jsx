import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";

import Header from "@components/common/Header";
import { AttendanceHistoryRenderItem } from "@components/teacher/Attendance.jsx";

import { getAttendanceHistoryByTeacherId } from "@controller/teacher/attendance.controller.js";
import { FlashList } from "@shopify/flash-list";

const AttendanceHistory = () => {
    const limit = 10;
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["attendance"],
        queryFn: ({ pageParam = 1 }) =>
            getAttendanceHistoryByTeacherId({ pageParam, limit }),
        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined,
        refetchOnMount: "always"
    });

    if (isError) return <div>Error: {error.message}</div>;

    const allItems = data?.pages?.flatMap(page => page.data);

    return (
        <View className="pt-12 flex-1 bg-white">
            <Header title="History" isAbsolute={true} />
            {isLoading && <ActivityIndicator size={"large"} />}
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
                    paddingTop: 40,
                    paddingBottom: 60
                }}
                ListEmptyComponent={
                    isFetchingNextPage && <ActivityIndicator size="small" />
                }
            />
        </View>
    );
};

export default AttendanceHistory;
