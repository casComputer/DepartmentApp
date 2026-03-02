import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import { useAppStore } from "@store/app.store.js";
import { isDatePassed } from "@utils/date.js";

const StatusBadge = ({ status, is_submitted }) => {
    if (status === "accepted") {
        return (
            <View className="flex-row items-center gap-1 bg-green-500/10 px-3 py-1 rounded-full">
                <MaterialCommunityIcons
                    name="seal-variant"
                    size={16}
                    color="#22c55e"
                />
                <Text className="text-xs font-bold text-green-500">
                    Accepted
                </Text>
            </View>
        );
    }

    if (status === "rejected") {
        return (
            <View className="bg-red-500/10 px-3 py-1 rounded-full">
                <Text className="text-xs font-bold text-red-500">Rejected</Text>
            </View>
        );
    }

    if (is_submitted) {
        return (
            <View className="bg-blue-500/10 px-3 py-1 rounded-full">
                <Text className="text-xs font-bold text-blue-400">
                    Submitted
                </Text>
            </View>
        );
    }

    return (
        <View className="bg-orange-500/10 px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-orange-400">Pending</Text>
        </View>
    );
};

export const AssignmentRenderItem = ({ item }) => {
    const userId = useAppStore(state => state.user.userId);

    const exists = item?.submissions?.find(
        submission => submission?.studentId === userId
    );

    const is_submitted = !!exists;
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
            className="rounded-2xl bg-card my-1 border border-border overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
        >

            <View className="p-4 gap-3">
                {/* Header row */}
                <View className="flex-row justify-between items-center">
                    <Text className="text-xs font-semibold text-text/40 uppercase tracking-widest">
                        {item.teacherId}
                    </Text>
                    <StatusBadge status={status} is_submitted={is_submitted} />
                </View>

                {/* Topic */}
                <Text className="text-xl font-black text-text leading-tight">
                    {item.topic}
                </Text>

                {/* Description */}
                <Text
                    className="text-sm text-text/60 font-medium"
                    numberOfLines={2}
                >
                    {item.description}
                </Text>

                {/* Footer row */}
                <View className="flex-row justify-between items-center pt-1 border-t border-border">
                    <Text className="text-xs font-semibold text-text/50">
                        {item.year} · {item.course}
                    </Text>

                    <View className="flex-row items-center gap-1">
                        <Feather
                            name="clock"
                            size={12}
                            color={isExpired ? "#ef4444" : "#888"}
                        />
                        <Text
                            className={`text-xs font-bold ${isExpired ? "text-red-500" : "text-text/50"}`}
                        >
                            {isExpired ? "Expired · " : "Due · "}
                            {new Date(item.dueDate).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
