import { View, Text, Pressable, Image, Platform } from "react-native";
import { router } from "expo-router";

import { formatDate } from "@utils/date.js";
import getPdfPreviewUrl from "@utils/pdfPreview.js";
import getMimeType from "@utils/getMimeType.js";
import { openFileWithDefaultApp, saveFile, downloadFile, deleteIfExists, ensureDirectoryPermission } from "@utils/file.js"

import {
    saveSystemStorageUri,
    getSystemStorageUri
} from "@storage/app.storage.js";

import CircularProgress from "@components/common/CircularProgress.jsx";

export const AssignmentRenderItem = ({ item }) => (
    <Pressable
        onPress={() =>
            router.push({
                params: {
                    item: JSON.stringify(item)
                },
                pathname: "/(teacher)/(others)/AssignmentShow"
            })
        }
        className="p-5 rounded-3xl dark:bg-zinc-900 mt-2"
        style={{ boxShadow: "0 1px 3px rgba(0, 0, 0, 0.5)" }}
    >
        <Text className="text-xl font-black dark:text-white">{item.topic}</Text>
        <Text
            numberOfLines={2}
            className="text-gray-600 font-bold text-lg pl-3 dark:text-white"
        >
            {item.description}
        </Text>

        <View className="flex-row justify-between items-center">
            <View>
                <Text className="text-xl font-black mt-3 dark:text-white">
                    {item.year} {item.course}
                </Text>
                <Text className="font-black text-lg dark:text-white">
                    Due Date:
                    {new Date(item.dueDate).toLocaleDateString()}
                </Text>
            </View>
            <View>
                <CircularProgress
                    size={60}
                    strokeWidth={5}
                    progress={
                        item.strength < 1
                            ? 0
                            : (item.submissions?.length / item.strength) * 100
                    }
                    fraction={`${item.submissions?.length || 0} / ${
                        item.strength || 0
                    }`}
                />
            </View>
        </View>
    </Pressable>
);

export const AssignmentShowRenderItem = ({ item }) => {
    let url = item.url;

    if (item.format === "pdf") {
        url = getPdfPreviewUrl(url);
    }

    
    return (
        <View className="justify-center rounded-lg dark:bg-zinc-900 p-4 gap-1">
            <Text className="font-bold text-2xl dark:text-white ">
                {item.studentId}
            </Text>
            <Text className="font-semibold text-md dark:text-white ">
                Submitted on {formatDate(item.createdAt)}{" "}
                {item.createdAt?.split("T")?.[1]?.split(".")?.[0]}
            </Text>

            <Pressable onPress={() => downloadFile(item.url, item.format)}>
            <View className="w-[90%] self-center mt-2 rounded-lg bg-zinc-950 h-[300px] overflow-hidden ">
                <Image
                    source={{ uri: url }}
                    
                    style={{ width: "100%", height: "100%" }}
                />
                <Text className="bg-zinc-700 w-full py-1 absolute bottom-0 left-0 text-center text-white">
                {
                    url.split('/')?.at(-1)
                }
                </Text>
        </View>
            </Pressable>
        </View>
    );
};
