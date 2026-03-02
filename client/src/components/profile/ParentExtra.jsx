import React from "react";
import { View, Text } from "react-native";
import { useAppStore } from "@store/app.store.js";

const ParentExtra = () => {
    const students = useAppStore(state => state.user.students);

    if (!students?.length) return null;

    return (
        <View className="mx-2 mt-4 bg-card border border-border rounded-3xl px-5 py-4 gap-3">
            {/* Label */}
            <Text className="text-text-secondary text-xs font-bold tracking-widest uppercase">
                {students.length === 1 ? "Student" : "Students"}
            </Text>

            {/* One chip per student */}
            <View className="flex-row flex-wrap gap-2">
                {students.map((s, i) => (
                    <View
                        key={i}
                        className="bg-card-selected border border-border rounded-full px-4 py-1.5"
                    >
                        <Text className="text-text font-bold text-sm">{s}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default ParentExtra;
