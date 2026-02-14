import {
    View,
    Text,
    ActivityIndicator,
    Image,
    TouchableOpacity,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

import Header from "@components/common/Header.jsx";

import getPdfPreviewUrl from "@utils/pdfPreview.js";
import { openFileInBrowser } from "@utils/file.js";

import { fetchExamResult } from "@controller/teacher/exam.controller.js";

const ResultItem = ({ item }) => {
    let url = item.secure_url;
    if (item.format === "pdf") {
        url = getPdfPreviewUrl(url);
    }

    return (
        <View className="p-4 bg-card mx-2 my-2 rounded-xl">
            <Text className="text-text text-xl font-bold mt-2">
                Uploaded By: {item.studentId}
            </Text>
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

const ExamResult = () => {
    const { course, sem } = useLocalSearchParams();

    const { data, isLoading } = useQuery({
        queryKey: ["examResults"],
        queryFn: () => fetchExamResult({ course, sem }),
    });

    return (
        <View className="flex-1 bg-primary">
            <Header title="Exam Results" />

            <FlashList
                data={data}
                className="pt-16"
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <ResultItem item={item} />}
                ListEmptyComponent={
                    isLoading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <Text className="text-text text-center text-lg mt-10">
                            No Results Found
                        </Text>
                    )
                }
            />
        </View>
    );
};

export default ExamResult;
