import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";

import Header from "@components/common/Header.jsx";
import { AssignmentRenderItem } from "@components/student/Assignment.jsx";

import { getAssignment } from "@controller/student/assignment.controller.js";
import { formatDate } from "@utils/date.js";

const ItemSeparator = ({ trailingItem, leadingItem }) => {
    const leadingDate = formatDate(leadingItem.timestamp);
    const trailingDate = formatDate(trailingItem.timestamp);

    if (leadingDate === trailingDate) return null;

    return (
        <Text className="my-6 text-xl font-bold px-3 dark:text-white">
            {trailingDate}
        </Text>
    );
};

const ListHeaderComponent = ({ date}) => {
    if(!date) return

    const fdate = formatDate(date);

    if (!fdate) return null;

    return (
        <Text className="my-6 text-xl font-bold px-3 dark:text-white">
            {fdate}
        </Text>
    );
};

const Assignment = () => {
    const {
        data,
        fetchNextPage,
        isFetchNextPage,
        hasNextPage,
        refetch,
        isRefetching
    } = useInfiniteQuery({
        queryKey: ["assignments"],
        queryFn: ({ pageParam = 1 }) => getAssignment({ pageParam }),
        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const assignments =
        data?.pages?.flatMap(page => page?.assignments ?? []) ?? [];

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <Header title="Assignments" />

            <FlashList
                data={assignments}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <AssignmentRenderItem item={item} />}
                onEndReached={() => {
                    if (hasNextPage && !isFetchNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 100,
                    gap: 16,
                    paddingTop: 16
                }}
                ListHeaderComponent={
                    <ListHeaderComponent
                        date={data?.pages?.[0]?.assignments?.[0]?.timestamp}
                    />
                }
                ListFooterComponent={
                    isFetchNextPage && (
                        <ActivityIndicator style={{ marginTop: 10 }} />
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
