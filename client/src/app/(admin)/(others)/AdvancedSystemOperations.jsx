import { View, Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";

import Header from "@components/common/Header";
import Prompt from "@components/common/Prompt";

import { usePromptStore } from "@store/app.store";
import { deleteAllDocsFromCollection } from "@controller/admin/table.controller";

const MONGODB_DELETE_OPTIONS = [
    "assignments",
    "exam-results",
    "internal-marks",
    "attendance-reports",
    "notes",
    "notifications",
    "records",
];

const TURSO_DELETE_OPTIONS = [
    "students",
    "teachers",
    "parents",
    "attendance-records",
    "worklogs",
    "fees",
    "users",
];

function toTitleCase(text) {
    return text
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map((word) => word[0]?.toUpperCase() + word.slice(1))
        .join(" ");
}

const deleteRecords = (value, db, option) => {
    console.log("Records deleted", value, db, option);
    deleteAllDocsFromCollection(option, db);
};

const handleDelete = (option, db, open) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

    let message = "This action cannot be undone.";
    let requireText = "";

    if (option === "students") {
        requireText = [
            "DELETE_ALL_STUDENTS",
            "DELETE_FIRST_BCA_STUDENTS",
            "DELETE_SECOND_BCA_STUDENTS",
            `DELETE_THIRD_BCA_STUDENTS`,
            "DELETE_FOURTH_BCA_STUDENTS",

            "DELETE_FIRST_BSC_STUDENTS",
            "DELETE_SECOND_BSC_STUDENTS",
            "DELETE_THIRD_BSC_STUDENTS",
            "DELETE_FOURTH_BSC_STUDENTS",
        ];
        message = `Enter DELETE_ALL_STUDENTS to remove all students.\n\nTo remove students from a specific class, enter DELETE_{YEAR}_{COURSE}_STUDENTS\n(e.g., DELETE_THIRD_BCA_STUDENTS)`;
    } else {
        requireText = `DELETE_ALL_${option.toUpperCase()?.split("-").join("_")}`;
    }

    open({
        title: `Delete ${option}`,
        message,
        requireText,
        onConfirm: (value) => deleteRecords(value, db, option),
    });
};

const AdvancedSystemOperations = () => {
    const { open } = usePromptStore();

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

                    {MONGODB_DELETE_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option}
                            className="self-start"
                            onPress={() =>
                                handleDelete(option, "mongodb", open)
                            }
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

                    {TURSO_DELETE_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option}
                            className="self-start"
                            onPress={() => handleDelete(option, "turso", open)}
                        >
                            <Text
                                className={`text-xl font-semibold text-text capitalize ${(option === "users" || option === "records") && "font-black text-red-500 uppercase"}`}
                            >
                                Delete {option.split("-").join(" ")}
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
