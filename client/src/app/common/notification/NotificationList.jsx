import { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";

import Loader from '@components/common/Loader';
import Header from "@components/common/Header";
import {
    ItemSeparator,
    ListHeaderComponent
} from "@components/common/ItemSeperatorDateComponent";

import { fetchNotifications } from "@controller/common/notification.controller.js";

import { downloadFile, checkFileExists } from "@utils/file.js";
import { getTime } from "@utils/date.js";
import getPreviewUrl from "@utils/pdfPreview.js";

const RenderItem = ({ item = {} }) => {
    const data = JSON.parse(item.data ?? "{}");
    const [downloading, setDownloading] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);

    const handleDownload = async () => {
        if (downloading) return;
        setDownloading(true);

        if (data.type === "ATTENDANCE_REPORT_GENERATION")
            await downloadFile(data.pdf_url, "pdf", `${data.filename}.pdf`);

        setIsDownloaded(true);
        setDownloading(false);
    };

    useEffect(() => {
        checkFileExists(`${data.filename}.pdf`).then(({ exists }) =>
            setIsDownloaded(exists)
        );
    }, [data.filename]);
    
    return (
        <View className="bg-card my-1 px-3 py-4 rounded-xl">
            <View className="flex-row items-center justify-between">
                <Text className="text-text font-black text-lg">
                    {item.title}
                </Text>
                <Text className="text-text/60 font-semibold text-sm">
                    {getTime(item.createdAt)}
                </Text>
            </View>

            <Text className="mt-2 text-text/80 font-semibold text-md max-w-[85%]">
                {item.body}
            </Text>

            {data.type === "ATTENDANCE_REPORT_GENERATION" && (
                <View className="py-3">
                    <View className="w-40 h-40 rounded-2xl overflow-hidden bg-card self-center mt-1">
                        <Image
                            source={{ uri: getPreviewUrl(data.pdf_url ?? "") }}
                            className="bg-card-selected"
                            style={{ width: "100%", height: "100%" }}
                        />
                    </View>
                    <TouchableOpacity
                        className="mt-2"
                        disabled={downloading}
                        onPress={handleDownload}
                    >
                        <Text className="text-xl font-bold text-blue-500 text-center">
                            {isDownloaded
                                ? "Open"
                                : downloading
                                  ? "Downloading"
                                  : "Download File"}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
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
        data?.pages?.flatMap(page => page?.notifications ?? []) ?? [];

    return (
        <View className="flex-1 bg-primary">
            <Header title="Notifications" />
            <FlashList
                data={notifications ?? []}
                ListEmptyComponent={
                    !isLoading ? (
                        <Text className="text-lg font-bold text-text text-center mt-5">
                            No Notifications Yet!
                        </Text>
                    ) : (
                        <Loader size="large" />
                    )
                }
                ListFooterComponent={
                    !isLoading &&
                    isFetchingNextPage && <Loader size="large" />
                }
                ListHeaderComponent={
                    <ListHeaderComponent date={notifications[0]?.createdAt} />
                }
                ItemSeparatorComponent={ItemSeparator}
                renderItem={({ item }) => <RenderItem item={item} />}
                contentContainerStyle={{ paddingBottom: 100 }}
                className="px-2 pt-16"
                onRefresh={refetch}
                refreshing={isRefetching}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default NotificationList;
