import { useState, useEffect, useRef } from "react";
import { View, Text, ToastAndroid } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";

import Header from "@components/common/Header";
import { AttendanceItem } from "@components/teacher/Attendance";
import { Options, ListEmptyComponent } from "@components/teacher/Attendance";
import { fetchStudentsByClass } from "@controller/teacher/students.controller";
import { getStudentCount } from "@utils/storage";

const Attendance = () => {
    const { course, year } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const storedCount = getStudentCount({ course, year }) || 0;

    const [students, setStudents] = useState(
        Array.from({ length: storedCount }, (_, i) => ({
            id: i + 1,
            present: false
        }))
    );

    const toggleAttendance = rollNo => {
        setStudents(prev =>
            prev.map(s => (s.id === rollNo ? { ...s, present: !s.present } : s))
        );
    };

    return (
        <View className="flex-1 pt-12">
            <Header title="Attendance" />

            <Options loading={loading} />

            <FlashList
                data={students}
                numColumns={5}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{
                    paddingVertical: 50,
                    paddingHorizontal: 10
                }}
                renderItem={({ item }) => (
                    <AttendanceItem
                        item={item}
                        toggleAttendance={toggleAttendance}
                        isSelecting={isSelecting}
                    />
                )}
                ListEmptyComponent={<ListEmptyComponent />}
            />
        </View>
    );
};

export default Attendance;
