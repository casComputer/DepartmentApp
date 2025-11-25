import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { ToastAndroid } from "react-native";

import Header from "@components/common/Header.jsx";
import { Options, AttendanceItem} from "@components/teacher/Attendance.jsx";

import { fetchStudentsByClass } from "@controller/teacher/students.controller.js";
import { getStudentCount } from "@utils/storage.ts";

const ITEM_SIZE = 60; // adjust as needed
const vw = 360; // example viewport width for font scaling

const Attendance = () => {
    const { course, year } = useLocalSearchParams();

    // Initialize using stored count
    const storedCount = getStudentCount({ course, year }) || 0;
    
    console.log('storedCount', storedCount, course, year)
    
    const [students, setStudents] = useState(
        Array.from({ length: storedCount }, (_, i) => ({
            id: i + 1,
            present: false
        }))
    );
    const [attendance, setAttendance] = useState({}); // { rollNo: true/false }

    useEffect(() => {
        if (!course || !year) return;

        const loadStudents = async () => {
            try {
                const fetched = await fetchStudentsByClass({ course, year });
                if (storedCount != 0 && fetched !== storedCount) {
                    setStudents(
                        Array.from({ length: fetched }, (_, i) => ({
                            id: i + 1,
                            present: false
                        }))
                    );
                    ToastAndroid.show(
                        `Change in student strength found!`,
                        ToastAndroid.LONG
                    );
                }
            } catch (err) {
                console.error("Failed to fetch students:", err);
            }
        };

        loadStudents();
    }, [course, year]);

    const toggleAttendance = rollNo => {
        setStudents(prev =>
            prev.map(s => (s.id === rollNo ? { ...s, present: !s.present } : s))
        );

        setAttendance(prev => ({
            ...prev,
            [rollNo]: !prev[rollNo]
        }));
    };

    return (
        <View className="flex-1 pt-12">
            <Header title="Attendance" />
            <Options />

            <FlashList
                data={students}
                numColumns={5}
                estimatedItemSize={ITEM_SIZE + 20}
                contentContainerStyle={{
                    paddingVertical: 50,
                    paddingHorizontal: 10
                }}
                keyExtractor={item => item?.id.toString()}
                renderItem={({ item }) => (
                    <AttendanceItem
                        item={item}
                        toggleAttendance={toggleAttendance}
                    />
                )}
            />
        </View>
    );
};

export default Attendance;
