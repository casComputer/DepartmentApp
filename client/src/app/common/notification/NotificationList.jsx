import { useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";

import Header from "@components/common/Header";
import {
    ItemSeparator,
    ListHeaderComponent
} from "@components/common/ItemSeperatorDateComponent";

import { fetchNotifications } from "@controller/common/notification.controller.js";

import { downloadFile } from "@utils/file.js";

const RenderItem = ({ item = {} }) => {
    // console.log(item);
    const data = JSON.parse(item.data ?? "{}");
    const [downloading, setDownloading] = useState(false);

    // {
    //     "_id": "698bfe99278d1b34cc0528e9",
    //     "body": "d Bca Is Now Available.",
    //     "createdAt": "2026-02-11T03:59:21.354Z",
    //     "data": "{
    //         \"pdf_url\":\""
    //         ,\"filename\":\"
    //         ,\"teacherId\":\"femina\",
    //         \"type\":\"ATTENDANCE_REPORT_GENERATION\"}"
    //         , "expiresAt": "2026-02-25T03:59:21.354Z",
    //         "reads": [],
    //         "target": ["class"]
    //         , "title": "Attendance Report Generated",
    //         "userIds": [],
    //         "yearCourse"
    //         : "Third-Bca"}

    const handleDownload = async () => {
        if (downloading) return;
        setDownloading(true);

        if (data.type === "ATTENDANCE_REPORT_GENERATION")
            await downloadFile(data.pdf_url, "pdf", `${data.filename}.pdf`);

        setDownloading(false);
    };

    return (
        <TouchableOpacity className="bg-card my-1 px-3 py-4 rounded-xl">
            <View className="flex-row items-center justify-between">
                <Text className="text-text font-black text-lg">
                    {item.title}
                </Text>
                <Text className="text-text/60 font-semibold text-sm">
                    {item.createdAt.split("T")[1].slice(0, 5)}
                </Text>
            </View>

            <Text className="mt-2 text-text/80 font-semibold text-md max-w-[85%]">
                {item.body}
            </Text>

            {data.type === "ATTENDANCE_REPORT_GENERATION" && (
                <TouchableOpacity
                    className="mt-2"
                    disabled={downloading}
                    onPress={handleDownload}
                >
                    <Text className="text-xl font-bold text-blue-500 text-center">
                        {downloading ? "Downloading" : "Download File"}
                    </Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

const NotificationList = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching
    } = useInfiniteQuery({
        queryKey: ["notifications"],
        queryFn: ({ pageParam = 1 }) => fetchNotifications(pageParam),
        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const notifications =
        data?.pages?.flatMap(page => page.notifications) ?? [];

    return (
        <View className="flex-1 bg-primary">
            <Header title="Notifications" />
            <FlashList
                data={notifications ?? []}
                ListEmptyComponent={
                    !isLoading && (
                        <Text className="text-lg font-bold text-text text-center mt-5">
                            No Notifications Yet!
                        </Text>
                    )
                }
                ListFooterComponent={
                    !isLoading &&
                    isFetchingNextPage && <ActivityIndicator size={"large"} />
                }
                ListHeaderComponent={
                    <ListHeaderComponent date={notifications[0]?.createdAt} />
                }
                ItemSeparatorComponent={ItemSeparator}
                renderItem={({ item }) => <RenderItem item={item} />}
                contentContainerStyle={{ paddingBottom: 100 }}
                className="px-2"
                onRefresh={refetch}
                refreshing={isRefetching}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default NotificationList;
