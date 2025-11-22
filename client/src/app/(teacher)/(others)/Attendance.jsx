import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

import Header from "@components/common/Header.jsx";
import { AttendanceItem, Options } from "@components/teacher/Attendance.jsx";

import { fetchStudentsByClass } from "@controller/teacher/students.controller.js";

const Attendance = () => {
    const { course, year } = useLocalSearchParams();
    const [students, setStudents] = useState([]);

    useEffect(() => {
        if (!course || !year) return;
        fetchStudentsByClass({ course, year, setStudents });
    }, [course, year, fetchStudentsByClass]);


    return (
        <View className="flex-1 pt-12">
            <Header title="Attendance" />
            <Options />

            <FlashList
                data={students}
                numColumns={5}
                contentContainerStyle={{
                    paddingVertical: 50,
                    paddingHorizontal: 10
                }}
                renderItem={({ item }) => <AttendanceItem item={item} />}
            />
        </View>
    );
};

export default Attendance;
