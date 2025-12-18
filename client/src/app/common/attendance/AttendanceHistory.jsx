import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIndicator, View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";

import Header from "@components/common/Header";
import { AttendanceHistoryRenderItem } from "@components/teacher/Attendance.jsx";
import {
	ItemSeparator,
	ListHeaderComponent,
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
		isRefetching,
	} = useInfiniteQuery({
		queryKey: ["attendance"],
		queryFn: ({ pageParam = 1 }) =>
			getAttendanceHistoryByTeacherId({ pageParam, limit }),
		getNextPageParam: (lastPage) =>
			lastPage.hasMore ? lastPage.nextPage : undefined,
		refetchOnMount: "always",
	});

	const allItems = data?.pages?.flatMap((page) => page.data);

	return (
		<View className="flex-1 bg-primary">
			<Header title="History" isAbsolute={true} />
			{isLoading && <ActivityIndicator size={"large"} />}
			<FlashList
				data={allItems}
				renderItem={({ item }) => <AttendanceHistoryRenderItem item={item} />}
				onEndReached={() => {
					if (hasNextPage && !isFetchingNextPage) fetchNextPage();
				}}
				onEndReachedThreshold={0.5}
				contentContainerStyle={{
					paddingTop: 40,
					paddingBottom: 60,
				}}
				ListEmptyComponent={
					isFetchingNextPage && <ActivityIndicator size="small" />
				}
				ItemSeparatorComponent={ItemSeparator}
				ListHeaderComponent={
					<ListHeaderComponent date={allItems?.[0]?.timestamp} />
				}
				onRefresh={refetch}
				refreshing={isRefetching}
			/>
		</View>
	);
};

export default AttendanceHistory;
