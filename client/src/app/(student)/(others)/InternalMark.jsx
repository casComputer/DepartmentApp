import { useState } from "react";
import {
    View,
    Text,
    Image,
    ActivityIndicator,
    Pressable,
    TouchableOpacity
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import Animated from "react-native-reanimated";
import { router } from "expo-router";

import Header from "@components/common/Header.jsx";
import Select from "@components/common/Select.jsx";

import getPreviewUrl from "@utils/pdfPreview.js";
import { formatDate } from "@utils/date.js";
import { downloadFile, openFileInBrowser } from "@utils/file.js";

import { fetchInternal } from "@controller/student/internal.controller.js";

const RenderItem = ({ item = {} }) => {
    const uri = getPreviewUrl(item.secure_url);

    const [downloading, setDownloading] = useState(false);

    const handleClickOpen = async () => {
        if (downloading) return;
        setDownloading(true);
        await downloadFile(item.secure_url, item.format, item.filename);
        setDownloading(false);
    };

    return (
        <View
            style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
            className="px-3 py-4 mt-2 bg-card border border-border rounded-3xl gap-2"
        >
            <Text className="text-text text-xl font-bold">
                {item.teacherId}
            </Text>
            <View className="w-56 h-56 rounded-2xl overflow-hidden bg-card self-center mt-1">
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/common/ImageFullView",
                            params: { url: uri }
                        })
                    }
                >
                    <Animated.Image
                        sharedTransitionTag="sharedTag"
                        source={{ uri }}
                        className="bg-card-selected"
                        style={{ width: "100%", height: "100%" }}
                    />
                </Pressable>
            </View>
            <TouchableOpacity
                onPress={handleClickOpen}
                disabled={downloading}
                className="self-center w-[80%] bg-card-selected rounded-xl justify-center items-center"
            >
                <Text className=" text-text text-xl font-bold py-2">
                    Open File
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => openFileInBrowser(item.secure_url)}
                className="self-center w-[80%] bg-card-selected rounded-xl justify-center items-center"
            >
                <Text className="text-text text-xl font-bold py-2">
                    Open In Browser
                </Text>
            </TouchableOpacity>
            <Text className="text-text/60 text-sm font-bold text-center">
                {item.filename}
            </Text>
            <Text className="text-text text-sm font-bold text-center">
                Uploaded on {formatDate(item.createdAt)}
            </Text>
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

    const internals = data?.pages?.flatMap(page => page.internals);

    return (
        <View className="flex-1 bg-primary">
            <Header title={"Internals"} />
            <FlashList
                data={internals}
                ListEmptyComponent={
                    !isLoading ? (
                        <Text className="text-lg font-bold text-text text-center mt-5">
                            No Internals Found!
                        </Text>
                    ) : (
                        <ActivityIndicator size="large" />
                    )
                }
                ListFooterComponent={
                    !isLoading &&
                    isFetchingNextPage && <ActivityIndicator size={"large"} />
                }
                renderItem={({ item }) => <RenderItem item={item} />}
                contentContainerStyle={{ paddingBottom: 100 }}
                className="px-1 pt-16"
                onRefresh={refetch}
                refreshing={isRefetching}
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
            />
        </View>
    );
};

export default InternalMark;
