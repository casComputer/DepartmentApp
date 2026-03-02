import { useState, useEffect } from "react";
import {
    View,
    Text,
    Pressable,
    TouchableOpacity
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import Animated from "react-native-reanimated";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

import Loader from "@components/common/Loader";
import Header from "@components/common/Header.jsx";
import getPreviewUrl from "@utils/pdfPreview.js";
import { formatDate } from "@utils/date.js";
import {
    downloadFile,
    openFileInBrowser,
    checkFileExists
} from "@utils/file.js";
import { fetchInternal } from "@controller/student/internal.controller.js";

const RenderItem = ({ item = {} }) => {
    const uri = getPreviewUrl(item.secure_url);
    const [downloading, setDownloading] = useState(false);

    const handleClickOpen = async () => {
        if (downloading) return;
        setDownloading(true);
        await downloadFile(item.secure_url, item.format, item.filename);
        setIsDownloaded(true);
        setDownloading(false);
    };

    const [isDownloaded, setIsDownloaded] = useState(false);

    useEffect(() => {
        checkFileExists(item.filename).then(({ exists }) =>
            setIsDownloaded(exists)
        );
    }, [item.filename]);

    return (
        <View
            style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.4)" }}
            className="mt-3 bg-card border border-border rounded-3xl overflow-hidden"
        >
            {/* Header strip */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
                <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center">
                        <Feather name="user" size={14} color="#888" />
                    </View>
                    <Text className="text-text font-bold text-base">
                        {item.teacherId}
                    </Text>
                </View>
                <Text className="text-text/40 text-xs font-semibold">
                    {formatDate(item.createdAt)}
                </Text>
            </View>

            {/* Preview */}
            <Pressable
                onPress={() =>
                    router.push({
                        pathname: "/common/ImageFullView",
                        params: { url: uri, tag: `internal-${item._id}` }
                    })
                }
                className="mx-4 mt-4 rounded-2xl overflow-hidden bg-card-selected"
                style={{ height: 200 }}
            >
                <Animated.Image
                    sharedTransitionTag={`internal-${item._id}`}
                    source={{ uri }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                />
                <View className="absolute bottom-2 right-2 bg-black/40 px-2 py-1 rounded-full flex-row items-center gap-1">
                    <Feather name="maximize-2" size={10} color="#fff" />
                    <Text className="text-white text-xs font-semibold">
                        Preview
                    </Text>
                </View>
            </Pressable>

            {/* Filename */}
            <Text
                className="text-text/50 text-xs font-medium text-center mt-3 px-4"
                numberOfLines={1}
            >
                {item.filename}
            </Text>

            {/* Actions */}
            <View className="flex-row gap-2 p-4">
                <TouchableOpacity
                    onPress={handleClickOpen}
                    disabled={downloading}
                    className="flex-1 flex-row items-center justify-center gap-2 bg-card-selected border border-border rounded-2xl py-3"
                >
                    {downloading ? (
                        <Loader size="small" />
                    ) : (
                        <Feather
                            name={isDownloaded ? "folder" : "download"}
                            size={16}
                            color="#888"
                        />
                    )}
                    <Text className="text-text font-bold text-sm">
                        {downloading
                            ? "Downloading..."
                            : isDownloaded
                              ? "Open"
                              : "Download"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => openFileInBrowser(item.secure_url)}
                    className="flex-1 flex-row items-center justify-center gap-2 bg-card-selected border border-border rounded-2xl py-3"
                >
                    <Feather name="globe" size={16} color="#888" />
                    <Text className="text-text font-bold text-sm">Browser</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const InternalMark = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching
    } = useInfiniteQuery({
        queryKey: ["internal"],
        queryFn: ({ pageParam = 1 }) => fetchInternal(pageParam),
        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const internals = data?.pages?.flatMap(page => page?.internals ?? []) ?? [];

    return (
        <View className="flex-1 bg-primary">
            <Header title="Internals" />
            <FlashList
                data={internals}
                ListEmptyComponent={
                    !isLoading ? (
                        <View className="items-center mt-16 gap-3">
                            <Feather name="inbox" size={40} color="#888" />
                            <Text className="text-lg font-bold text-text/50">
                                No Internals Found
                            </Text>
                        </View>
                    ) : (
                        <Loader size="large" />
                    )
                }
                ListFooterComponent={
                    !isLoading && isFetchingNextPage ? (
                        <Loader size="large" />
                    ) : null
                }
                renderItem={({ item }) => <RenderItem item={item} />}
                contentContainerStyle={{
                    paddingBottom: 100,
                    paddingHorizontal: 12
                }}
                className="pt-16"
                onRefresh={refetch}
                refreshing={isRefetching}
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
                estimatedItemSize={340}
            />
        </View>
    );
};

export default InternalMark;
