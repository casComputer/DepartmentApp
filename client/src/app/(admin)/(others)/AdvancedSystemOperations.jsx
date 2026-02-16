import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";

import Header from "@components/common/Header";

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
    "delete-students",
    "delete-teachers",
    "delete-parents",
    "delete-attendance-records",
    "delete-worklogs",
    "delete-fees-records",
    "delete-users",
    "delete-records"
];

const AdvancedSystemOperations = () => {
    const handleDelete = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
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
                            onPress={() => handleDelete("assignments")}
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
                            onPress={() => handleDelete("assignments")}
                        >
                            <Text
                                className={`text-xl font-semibold text-text capitalize ${(option === "delete-users" || option === "delete-records") && "font-black text-red-500 uppercase"}`}
                            >
                                {option.split("-").join(" ")}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

export default AdvancedSystemOperations;
