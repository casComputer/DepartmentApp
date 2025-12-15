import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { Feather } from "@icons";

import Header from "@components/common/Header.jsx";
import { AssignmentRenderItem } from "@components/teacher/Assignment.jsx";

import { getAssignment } from "@controller/teacher/assignment.controller.js";

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
        isRefetching,
        isPending
    } = useInfiniteQuery({
        queryKey: ["assignments"],
        queryFn: ({ pageParam = 1 }) => getAssignment({ pageParam }),

        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });
    
    return (
        <View className="flex-1 bg-white dark:bg-black">
            <Header title="Assignments" />
            
            {
                (isPending && !isFetchNextPage) && <ActivityIndicator style={{ marginTop: 8,}} />
            }

            <FlashList
                data={data?.pages.flatMap(page => page.assignments) || []}
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
                    <ListHeaderComponent
                        date={data?.pages?.[0]?.assignments?.[0]?.timestamp}
                    />
                }
                ListFooterComponent={isFetchNextPage && <ActivityIndicator style={{ marginTop: 10,}} />}
                onRefresh={refetch}
                refreshing={isRefetching}
                ItemSeparatorComponent={ItemSeparator}
                
            />

            <TouchableOpacity
                className=" p-4 rounded-full bg-pink-500 absolute right-5 bottom-10 justify-center items-center"
                onPress={() =>
                    router.push("/(teacher)/(others)/AssignmentCreation")
                }
            >
                <Feather name="plus" size={30} className="dark:text-white" />
            </TouchableOpacity>
        </View>
    );
};

export default Assignment;
