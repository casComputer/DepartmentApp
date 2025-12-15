import { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router"

import {
    handleDocumentPick,
    handleAssignmentUpload
} from "@controller/student/assignment.controller.js";

import Header from "@components/common/Header2.jsx";
import Progress from "@components/common/CircularProgress.jsx";

import queryClient from "@utils/queryClient";

import { useAppStore } from "@store/app.store.js";

const { width: vw } = Dimensions.get("window");
const studentId = useAppStore.getState().user.userId;

const AssignmentUpload = () => {
    const [file, setFile] = useState(null);
    const [ uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(null);

    const { assignmentId, topic, description, dueDate } =
        useLocalSearchParams();

    const handleUpload = async () => {
        if (uploading) return;
        setUploading(true)
        const is_uploaded = await handleAssignmentUpload(
            file,
            assignmentId,
            setProgress
        );
        if (is_uploaded) {
            // adding studentid to submissions list

            queryClient.setQueryData(["assignments"], prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    pages: prev.pages.map(page => ({
                        ...page,
                        assignments: page.assignments.map(assignment =>
                            assignment._id === assignmentId
                                ? {
                                      ...assignment,
                                      submissions: [
                                          ...(assignment.submissions ?? []),
                                          { studentId }
                                      ]
                                  }
                                : assignment
                        )
                    }))
                };
            });
            router.back()
        }

        setProgress(null);
        setUploading(false);
    };

    return (
        <View className="flex-1 bg-white dark:bg-black gap-3">
            <Header />

            <View className="p-5 flex-1">
                <Text className="text-3xl font-black dark:text-white mt-5">
                    Topic: {topic}
                </Text>
                <Text className="text-lg mt-3 dark:text-zinc-400">
                    Description: {description}
                </Text>
                <Text className="text-lg mb-6 mt-3 dark:text-white">
                    Due Date: {new Date(dueDate).toLocaleDateString()}
                </Text>
                {/* Add your file upload component or logic here */}
                {file && (
                    <>
                        <Text className="font-semibold text-xl mt-5 dark:text-white">
                            File Name: {file.name}
                        </Text>
                        <Text className="font-semibold text-xl mt-1 dark:text-white">
                            Size: {(file.size / (1024 * 1024)).toFixed(2)} mb
                        </Text>
                    </>
                )}
                {file ? (
                    <TouchableOpacity
                        disabled={progress !== null}
                        onPress={handleUpload}>
                        <Text className="text-blue-500 text-center font-bold text-3xl mt-10">
                            {progress !== null ? "Uploading.." : "Upload"}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => handleDocumentPick(setFile)}>
                        <Text className="text-blue-500 text-center font-bold text-3xl mt-5">
                            Select File
                        </Text>
                    </TouchableOpacity>
                )}
                <View className="flex-1">
                    {progress !== null && (
                        <Progress
                            progress={progress}
                            size={150}
                            strokeWidth={15}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

export default AssignmentUpload;
