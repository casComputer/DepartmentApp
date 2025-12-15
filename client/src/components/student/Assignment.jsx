import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAppStore } from "@store/app.store.js";

const Status = ({ status, is_submitted }) => {
    if (status === "accepted") {
        return (
            <MaterialCommunityIcons
                name="seal-variant"
                size={26}
                color="#39ee17"
            />
        );
    }

    if (status === "rejected") {
        return (
            <Text className="text-md font-black text-red-500">Rejected</Text>
        );
    }

    if (is_submitted) {
        return (
            <Text className="text-sm font-black text-green-500">Submitted</Text>
        );
    }

    return null;
};

export const AssignmentRenderItem = ({ item }) => {
    const userId = useAppStore(state => state.user.userId);

    const is_submitted = item?.submissions?.some(
        submission => submission?.studentId === userId
    );
    const status =
        item?.submissions?.find(submission => submission?.studentId === userId)
            ?.status || "_";

    return (
        <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: "/(student)/(others)/AssignmentUpload",
                    params: {
                        assignmentId: item._id,
                        topic: item.topic,
                        description: item.description,
                        dueDate: item.dueDate
                    }
                })
            }
            disabled={is_submitted && status !== "rejected"}
            activeOpacity={0.7}
            className="p-4 rounded-3xl dark:bg-zinc-900 my-2"
            style={{ boxShadow: "0 1px 3px rgba(0, 0, 0, 0.5)" }}
        >
            <View className="flex-row py-2 justify-between items-center">
                <Text className="font-black opacity-50 text-mg dark:text-white">
                    {item.teacherId}
                </Text>

                <Status status={status} is_submitted={is_submitted} />
            </View>
            <Text className="text-xl font-black dark:text-white">
                {item.topic}
            </Text>
            <Text className="text-gray-600 font-bold text-lg pl-3 dark:text-white">
                {item.description}
            </Text>
            <Text className="text-xl font-black mt-3 dark:text-white">
                {item.year} {item.course}
            </Text>
            <Text className="font-black text-lg dark:text-white">
                Due Date:
                {new Date(item.dueDate).toLocaleDateString()}
            </Text>
        </TouchableOpacity>
    );
};
