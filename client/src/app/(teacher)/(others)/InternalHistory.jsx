import { View, Image, Text, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";

import Header from "@components/common/Header.jsx";

import { getHistory } from "@controller/teacher/internal.controller.js";

import getPdfPreviewUrl from "@utils/pdfPreview.js";
import { openFileInBrowser } from "@utils/file.js";

const Item = ({ item }) => {
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
    const { data, isLoading, isError } = useQuery({
        queryKey: ["internalHistory"],
        queryFn: getHistory,
    });

    console.log(data)

    return (
        <View className="flex-1 bg-primary">
            <Header title={"History"} />

            <FlashList data={data ?? []} renderItem={({item})=> <Item item={item} />} />
        </View>
    );
};

export default InternalHistory;
