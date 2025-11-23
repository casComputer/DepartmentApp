import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export const ListHeaderComponent = ({
    loading,
    year,
    course,
    handleVerifyAll
}) => {
    const [verifying, setVerifying] = useState(false);

    const handlePress = async () => {
        setVerifying(true);
        await handleVerifyAll();
        setVerifying(false);
    };

    return (
        <View className="flex-row justify-between items-center py-5">
            <Text className="text-3xl font-bold">
                {year} {course}
            </Text>
            {loading ? (
                <Text className="text-md font-semibold py-2">syncing..</Text>
            ) : (
                <View className="flex-row justify-center items-center gap-2">
                    <TouchableOpacity
                        onPress={() =>
                            router.push("(teacher)/AssignRollNumber")
                        }
                        disabled={verifying}
                        style={{ elevation: 5 }}
                        className="px-3 py-2 rounded-3xl bg-green-500 justify-center items-center">
                        <Text className="text-xl font-bold text-white">
                            Assign RollNo
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handlePress}
                        disabled={verifying}
                        style={{ elevation: 5 }}
                        className="px-3 py-2 rounded-3xl bg-green-500 justify-center items-center">
                        <Text className="text-xl font-bold text-white">
                            {verifying ? "Verifying" : "Verify"}
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
    <Text className="text-2xl font-black pt-14 text-center">
        {statusMessages[status] || ""}
    </Text>
);
