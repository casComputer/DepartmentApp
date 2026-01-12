import { useState } from "react";
import { View, Text, Pressable } from "react-native";

const showDate = date => {
    const formatted = new Date(date).toLocaleDateString();
    const today = new Date();
    if (formatted === today.toLocaleDateString()) return "Today";
    const yes = new Date(today.setDate(today.getDate() - 1));
    if (formatted === yes.toLocaleDateString()) return "Yesterday";
    return formatted;
};

export const HistoryRenderItem = ({ item }) => {
    const [showFullTopics, setShowFullTopics] = useState(false);

    return (
        <View
            style={{
                boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.5)"
            }}
            className="bg-card m-2 p-4 rounded-3xl"
        >
            <View className="flex-row justify-between items-center mb-2">
                <Text
                    numberOfLines={2}
                    className="flex-1 text-xl font-black text-text"
                >
                    {item.subject}
                </Text>
                <View className="items-end px-4">
                    <Text className="text-sm font-bold opacity-80 text-text">
                        {showDate(item.date)}
                    </Text>
                    <Text className="text-lg font-bold text-text">
                        {item.year} {item.course}
                    </Text>
                    <Text className="text-lg font-bold text-text">
                        {item.hour} Hour
                    </Text>
                </View>
            </View>

            <Text className="text-md font-bold mt-5 text-text">
                Topics:
            </Text>

            <Text
                numberOfLines={showFullTopics ? undefined : 1}
                className="text-xl pl-3 text-text max-w-[90%]"
            >
                {item.topics} 
            </Text>
            <Pressable onPress={() => setShowFullTopics(prev => !prev)}>
                <Text className="text-sm pl-3 font-bold text-blue-400 opacity-70">
                    {showFullTopics ? "less" : "more"}
                </Text>
            </Pressable>
        </View>
    );
};