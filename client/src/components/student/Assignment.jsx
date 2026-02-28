import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAppStore } from "@store/app.store.js";
import { isDatePassed } from "@utils/date.js";

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

    const exists = item?.submissions?.find(
        submission => submission?.studentId === userId
    );

    const status = exists?.status || "_";
    const rejectionMessage = exists?.rejectionMessage ?? "";
    const isExpired = isDatePassed();

    return (
        <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: "/(student)/(others)/AssignmentUpload",
                    params: {
                        assignmentId: item._id,
                        topic: item.topic,
                        description: item.description,
                        dueDate: item.dueDate,
                        rejectionMessage,
                        status,
                        isExpired,
                        is_submitted
                    }
                })
            }
            activeOpacity={0.7}
            className="p-4 rounded-3xl bg-card my-2 border border-border"
            style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
        >
            <View className="flex-row py-2 justify-between items-center">
                <Text className="font-black opacity-50 text-mg text-text">
                    {item.teacherId}
                </Text>

                <Status status={status} is_submitted={is_submitted} />
            </View>
            <Text className="text-xl font-black text-text">{item.topic}</Text>
            <Text className="font-bold text-lg pl-3 text-text/80">
                {item.description}
            </Text>
            <Text className="text-xl font-black mt-3 text-text">
                {item.year} {item.course}
            </Text>
            <Text
                className={`font-black text-lg ${isExpired ? "text-red-500" : "text-text"}`}
            >
                Due Date:
                {new Date(item.dueDate).toLocaleDateString()}
            </Text>
        </TouchableOpacity>
    );
};
