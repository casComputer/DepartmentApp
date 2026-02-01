import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useAppStore } from "@store/app.store.js";

const ParentExtra = () => {
    const students = useAppStore(state => state.user.students);

    if (!students?.length) return null;

    const studentText =
        students.length === 1
            ? students[0]
            : students.slice(0, -1).join(",") + " and " + students.at(-1);

    return (
        <View className="px-2 pt-3">
            <Text className="text-text-secondary font-black text-3xl">
                {students.length > 0 ? "Students" : "Student:"}
            </Text>

            <Text className="pl-5 text-text font-bold text-xl">
                {studentText}
            </Text>
        </View>
    );
};

export default ParentExtra;
