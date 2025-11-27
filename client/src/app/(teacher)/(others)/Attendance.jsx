import { useState, useEffect } from "react";
import { View, ToastAndroid } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";

import Header from "@components/common/Header2";
import {
    Options,
    ListEmptyComponent,
    AttendanceItem
} from "@components/teacher/Attendance";

import { fetchStudentsByClass } from "@controller/teacher/students.controller.js";
import { saveAttendance } from "@controller/teacher/attendance.controller.js";

import { getStudentCount } from "@utils/storage";

const Attendance = () => {
    const { course, year, hour } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const storedCount = getStudentCount({ course, year }) || 0;

    const [students, setStudents] = useState(
        Array.from({ length: storedCount }, (_, i) => ({
            rollno: i + 1,
            present: false
        }))
    );

    useEffect(() => {
        if (!course || !year) return;

        const loadStudents = async () => {
            try {
                setLoading(true);
                const { students: newStudents } =
                    await fetchStudentsForAttendance({
                        course,
                        year
                    });

                setStudents(newStudents);
                if (storedCount !== newStudents?.length)
                    ToastAndroid.show(
                        `Change in student strength found!`,
                        ToastAndroid.LONG
                    );
            } catch (err) {
                console.error("Failed to fetch students:", err);
            } finally {
                setLoading(false);
            }
        };

        loadStudents();
    }, [course, year, storedCount, setStudents]);

    const toggleAttendance = rollno => {
        setStudents(prev =>
            prev.map(s =>
                s.rollno === rollno ? { ...s, present: !s.present } : s
            )
        );
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            await saveAttendance({
                students,
                course,
                year,
                hour
            });
        } catch (err) {
            console.error("Failed to save attendance:", err);
        } finally {
            setSaving(false);
            router.back();
        }
    };

    return (
        <View className="flex-1 pt-12 bg-white">
            <Header onSave={handleSave} saving={saving} disabled={loading} />

            <Options loading={loading} />

            <FlashList
                data={students}
                numColumns={5}
                keyExtractor={item => item.rollno.toString()}
                contentContainerStyle={{
                    paddingVertical: 50,
                    paddingHorizontal: 10
                }}
                renderItem={({ item }) => (
                    <AttendanceItem
                        item={item}
                        toggleAttendance={toggleAttendance}
                    />
                )}
                ListEmptyComponent={<ListEmptyComponent />}
            />
        </View>
    );
};

export default Attendance;
