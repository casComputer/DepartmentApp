import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { removeAllStudents } from "@controller/teacher/students.controller.js";
import showConfirm from "@utils/confirm.js";

export const ListHeaderComponent = ({
    loading,
    year,
    course,
    handleVerifyAll
}) => {
    const [verifying, setVerifying] = useState(false);
    const [removing, setRemoving] = useState(false);

    const handlePress = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        showConfirm("Are you sure to verify all the students?", async () => {
            setVerifying(true);
            await handleVerifyAll();
            setVerifying(false);
        });
    };

    const handleRemoveAll = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        showConfirm("Are you sure to remove all the students?", async () => {
            setRemoving(true);
            await removeAllStudents();
            setRemoving(false);
        });
    };

    return (
        <View className="flex-row justify-between items-center py-3 px-3">
            <Text className="text-xl font-bold pl-1 text-text-secondary">
                {year} {course}
            </Text>
            {loading ? (
                <Text className="text-md font-semibold py-2 text-text">
                    syncing..
                </Text>
            ) : (
                <View className="flex-row justify-center items-center gap-1">
                    <TouchableOpacity
                        onPress={() =>
                            router.push("(teacher)/AssignRollNumber")
                        }
                        disabled={verifying}
                        className="px-3 py-2 rounded-3xl bg-btn justify-center items-center"
                    >
                        <Text
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            className="text-md font-bold text-text"
                        >
                            Roll Number
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handlePress}
                        disabled={verifying}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        className="px-3 py-2 rounded-3xl bg-btn justify-center items-center"
                    >
                        <Text className="text-md font-bold text-text">
                            {verifying ? "Verifying" : "Verify All"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleRemoveAll}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        disabled={removing}
                        className="px-3 py-2 rounded-3xl bg-btn justify-center items-center"
                    >
                        <Text className="text-md font-bold text-text">
                            {removing ? "Removing" : "Remove All"}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export const statusMessages = {
    LOADING: "Loading...",
    ERROR: "Something Went Wrong!, Try again later.",
    CLASS_EMPTY: "No Students Yet!",
    NO_CLASS_ASSIGNED: "You are not assigned to any class!"
};

export const ListEmptyComponent = ({ status }) => (
    <Text className="text-2xl font-black pt-14 text-center text-text">
        {statusMessages[status] || ""}
    </Text>
);
