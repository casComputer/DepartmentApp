import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

import CircularProgress from "@components/common/CircularProgress.jsx";

export const AssignmentRenderItem = ({ item }) => (
    <Pressable
        onPress={() =>
            router.push({
                params: {
                    item: JSON.stringify(item)
                },
                pathname: "/(teacher)/(others)/AssignmentShow"
            })
        }
        className="p-5 rounded-3xl dark:bg-zinc-900 mt-2"
        style={{ boxShadow: "0 1px 3px rgba(0, 0, 0, 0.5)" }}>
        <Text className="text-xl font-black dark:text-white">{item.topic}</Text>
        <Text
            numberOfLines={2}
            className="text-gray-600 font-bold text-lg pl-3 dark:text-white">
            {item.description}
        </Text>

        <View className="flex-row justify-between items-center">
            <View>
                <Text className="text-xl font-black mt-3 dark:text-white">
                    {item.year} {item.course}
                </Text>
                <Text className="font-black text-lg dark:text-white">
                    Due Date:
                    {new Date(item.dueDate).toLocaleDateString()}
                </Text>
            </View>
            <View>
                <CircularProgress
                    size={60}
                    strokeWidth={5}
                    progress={
                        item.strength < 1
                            ? 0
                            : (item.submissions?.length / item.strength) * 100
                    }
                    fraction={`${item.submissions?.length || 0} / ${
                        item.strength || 0
                    }`}
                />
            </View>
        </View>
    </Pressable>
);
