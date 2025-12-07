import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";

import Header from "@components/common/Header.jsx";
import { AssignmentRenderItem } from "@components/student/Assignment.jsx";

import { getAssignment } from "@controller/student/assignment.controller.js";

const Assignment = () => {
    
    const { data, fetchNextPage, isFetchNextPage, hasNextPage } =
        useInfiniteQuery({
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
            />
        </View>
    );
};

export default Assignment;
