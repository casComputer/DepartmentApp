import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";

import {
    handleDocumentPick,
    handleAssignmentUpload
} from "@controller/student/assignment.controller.js";

import Header from "@components/common/Header2.jsx";
import Progress from "@components/common/CircularProgress.jsx";

import queryClient from "@utils/queryClient";

import { useAppStore } from "@store/app.store.js";

const studentId = useAppStore.getState().user.userId;

const AssignmentUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(null);

    const {
        assignmentId,
        topic,
        description,
        dueDate,
        status,
        isExpired,
        is_submitted,
        rejectionMessage
    } = useLocalSearchParams();

    const handleUpload = async () => {
        if (uploading) return;
        setUploading(true);
        setProgress(1);
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
            router.back();
        }

        setProgress(null);
        setUploading(false);
    };

    const expired = isExpired === "true";
    const submitted = is_submitted === "true";

    const canShowSelectBtn = !expired && (!submitted || status !== "accepted");

    return (
        <View className="flex-1 bg-primary gap-3">
            <Header />

            <View className="p-5 flex-1">
                <Text className="text-3xl font-black text-text mt-5">
                    Topic: {topic}
                </Text>
                <Text className="text-lg mt-3 text-text/60">
                    Description: {description}
                </Text>
                <Text className="text-lg mb-6 mt-3 text-text">
                    Due Date: {new Date(dueDate).toLocaleDateString()}
                </Text>
                {/* Add your file upload component or logic here */}
                {file && (
                    <>
                        <Text className="font-semibold text-xl mt-5 text-text">
                            File Name: {file.name}
                        </Text>
                        <Text className="font-semibold text-xl mt-1 text-text">
                            Size: {(file.size / (1024 * 1024)).toFixed(2)} mb
                        </Text>
                    </>
                )}
                {file ? (
                    <TouchableOpacity
                        disabled={progress !== null}
                        onPress={handleUpload}
                    >
                        <Text className="text-blue-500 text-center font-bold text-3xl mt-10">
                            {progress !== null ? "Uploading.." : "Upload"}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    canShowSelectBtn && (
                        <TouchableOpacity
                            onPress={() => handleDocumentPick(setFile)}
                        >
                            <Text className="text-blue-500 text-center font-bold text-3xl mt-5">
                                Select File
                            </Text>
                        </TouchableOpacity>
                    )
                )}

                {submitted ? (
                    <Text className="text-center mt-5 text-text text-xl font-bold">
                        Submitted 🎉 {"\n"}
                        Status: {status === "_" ? "pending" : status}
                    </Text>
                ) : null}
                {status === "rejected" ? (
                    <Text className="mt-5 text-center text-yellow-500 text-lg font-semibold">
                        Reason For Rejection: {"\n"}
                        {rejectionMessage?.trim() ?? "Nothing specified!"}
                    </Text>
                ) : null}
            </View>
            {progress !== null && (
                <View className="absolute w-full h-full top-0 left-0 z-20 bg-[#00000095]">
                    <Progress progress={progress} size={150} strokeWidth={15} />
                </View>
            )}
        </View>
    );
};

export default AssignmentUpload;
