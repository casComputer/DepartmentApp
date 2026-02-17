import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";

import Header from "@components/common/Header";
import Prompt from "@components/common/Prompt";

import { usePromptStore } from "@store/app.store";

const MONGODB_DELETE_OPTIONS = [
    "assignments",
    "exam-results",
    "internal-marks",
    "attendance-reports",
    "notes",
    "notifications",
    "records"
];

const TURSO_DELETE_OPTIONS = [
    "students",
    "teachers",
    "parents",
    "attendance-records",
    "worklogs",
    "fees-records",
    "users",
    "records"
];

function toTitleCase(text) {
    return text
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map(word => word[0]?.toUpperCase() + word.slice(1))
        .join(" ");
}

const AdvancedSystemOperations = () => {
    const { visible, title, message, requireText, onConfirm, close } =
        usePromptStore();

    const { open } = usePromptStore();

    const handleDelete = option => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

        let message = "This action cannot be undone.";

        if (option === "students")
            message =
                `Enter DELETE_ALL_STUDENTS to remove all students.\n\nTo remove students from a specific class, enter DELETE_{YEAR}_{COURSE}_STUDENTS\n(e.g., DELETE_THIRD_BCA_STUDENTS)`
        open({
            title: `Delete ${option}`,
            message,
            requireText: "DELETE",
            onConfirm: () => deleteRecords()
        });
    };

    return (
        <View className="flex-1 bg-primary px-2">
            <Header title="Advanced Operations" />

            <View className="pt-16" />

            <View className="border border-border px-3 bg-card py-5 rounded-2xl">
                <Text className="text-2xl font-black text-text-secondary">
                    Database Operations
                </Text>
                <View className="pl-2 py-4 gap-2">
                    <Text className="text-xl font-bold text-text text-center">
                        • Mongodb •
                    </Text>

                    {MONGODB_DELETE_OPTIONS.map(option => (
                        <TouchableOpacity
                            key={option}
                            className="self-start"
                            onPress={() => handleDelete(option, "mongodb")}
                        >
                            <Text
                                className={`text-xl font-semibold text-text capitalize ${option === "records" && "font-black text-red-500 uppercase"}`}
                            >
                                Delete {option.split("-").join(" ")}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <Text className="mt-3 text-xl font-bold text-text text-center">
                        • Turso DB •
                    </Text>

                    {TURSO_DELETE_OPTIONS.map(option => (
                        <TouchableOpacity
                            key={option}
                            className="self-start"
                            onPress={() => handleDelete(option, "turso")}
                        >
                            <Text
                                className={`text-xl font-semibold text-text capitalize ${(option === "delete-users" || option === "delete-records") && "font-black text-red-500 uppercase"}`}
                            >
                                Delete {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <Prompt />
        </View>
    );
};

export default AdvancedSystemOperations;
