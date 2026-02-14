import { View, Image, Text, TouchableOpacity , ActivityIndicator} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";

import Header from "@components/common/Header.jsx";
import {ItemSeparator} from "@components/common/ItemSeperatorDateComponent.jsx";

import { getHistory } from "@controller/teacher/internal.controller.js";

import getPdfPreviewUrl from "@utils/pdfPreview.js";
import { openFileInBrowser } from "@utils/file.js";

const Item = ({ item={} }) => {
    let url = item.secure_url;
    if (item.format === "pdf") {
        url = getPdfPreviewUrl(url);
    }

    return (
        <View className="p-4 bg-card mx-2 my-2 rounded-xl">
            <Text className="text-text">{item.filename}</Text>
            <Image
                className="w-full h-48 bg-card-selected rounded-2xl mt-3"
                source={{ uri: url }}
            />
            <TouchableOpacity
                onPress={() => openFileInBrowser(item.secure_url)}
                className="bg-primary px-4 py-3 rounded-lg mt-3 w-full"
            >
                <Text className="text-text font-bold text-center">
                    Open in Browser
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const InternalHistory = () => {
    
    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        refetch,
        isRefetching,
        isLoading
    } = useInfiniteQuery({
        queryKey: ["internals"],
        queryFn: ({ pageParam = 1 }) => getHistory(pageParam),

        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });
    
    console.log(data);
    
    const allItems = data?.pages.flatMap(page => page.internals) || [];

    console.log(allItems);
    return (
        <View className="flex-1 bg-primary">
            <Header title={"History"} />

            <FlashList
                data={allItems ?? []}
                // keyExtractor={item => item._id}
                className="pt-16 px-1"
                renderItem={({ item }) => <Item item={item} />}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
                maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
                contentContainerStyle={{
                    paddingBottom: 100,
                }}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <ActivityIndicator size={"small"} />
                    ) : (
                        !hasNextPage &&
                        !isLoading &&
                        allItems?.length > 5 && (
                            <Text className="text-lg font-bold text-text text-center py-3">
                                Nothing else down here 👋
                            </Text>
                        )
                    )
                }
                ListEmptyComponent={
                    isLoading ? (
                        <ActivityIndicator size={"large"} />
                    ) : (
                        <Text className="font-bold text-text text-center text-lg">
                            No internls upload yet.
                        </Text>
                    )
                }
                onRefresh={refetch}
                refreshing={isRefetching}
                ItemSeparatorComponent={ItemSeparator}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default InternalHistory;
