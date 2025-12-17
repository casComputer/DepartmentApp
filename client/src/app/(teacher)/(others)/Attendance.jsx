import { useState, useEffect, useRef } from "react";
import { View, ToastAndroid, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";

import Header from "@components/common/Header2";
import {
    Options,
    ListEmptyComponent,
    AttendanceItem
} from "@components/teacher/Attendance";

import {
    fetchStudentsForAttendance,
    saveAttendance
} from "@controller/teacher/attendance.controller.js";

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

    // ---- DRAG SELECTION REFS ----
    const itemLayouts = useRef({});
    const touchStartPosition = useRef({});
    const dragged = useRef(new Set());
    const dragging = useRef(false);
    const isDragMode = useRef(false);

    const scrollViewRef = useRef();
    const scrollOffset = useRef(0);
    const scrollViewY = useRef(0);

    const onItemLayout = id => e => {
        itemLayouts.current[id] = e.nativeEvent.layout;
    };

    const convertPageToLocalY = pageY => {
        return pageY - scrollViewY.current + scrollOffset.current;
    };

    const handleTouch = event => {
        const { pageY, pageX } = event;

        const localY = convertPageToLocalY(pageY);
        const localX = pageX;

        for (const key in itemLayouts.current) {
            const l = itemLayouts.current[key];

            if (
                localX >= l.x &&
                (localX <= l.x + l.width ||
                    l.y > touchStartPosition?.current?.y ||
                    l.x + l.width > touchStartPosition?.current?.x) &&
                localY >= l.y &&
                localY <= l.y + l.height
            ) {
                if (!dragged.current.has(key)) {
                    dragged.current.add(key);
                    toggleAttendance(Number(key));
                }
            }
        }
    };

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

                setStudents(prev =>
                    prev.map((student, i) => ({
                        ...student,
                        rollno: newStudents[i]?.rollno,
                        studentId: newStudents[i]?.studentId
                    }))
                );

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
    }, [course, year, storedCount]);

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
        }
    };

    const longPressHandler = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        isDragMode.current = true;
    };

    return (
        <View className="flex-1 bg-primary">
            <Header onSave={handleSave} saving={saving} disabled={loading} />

            <Options loading={loading} />

            <ScrollView
                ref={scrollViewRef}
                onScroll={e => {
                    scrollOffset.current = e.nativeEvent.contentOffset.y;
                }}
                scrollEventThrottle={16}
                onLayout={() => {
                    scrollViewRef.current.measure(
                        (x, y, w, h, pageX, pageY) => {
                            scrollViewY.current = pageY;
                        }
                    );
                }}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderGrant={({ nativeEvent }) => {
                    if (!isDragMode.current) return;
                    dragging.current = true;

                    touchStartPosition.current = {
                        x: nativeEvent.pageX,
                        y: convertPageToLocalY(nativeEvent.pageY)
                    };
                    handleTouch(nativeEvent);
                }}
                onResponderMove={e => {
                    if (!isDragMode.current) return;
                    if (dragging.current) handleTouch(e.nativeEvent);
                }}
                onResponderRelease={() => {
                    dragging.current = false;
                    dragged.current.clear();
                    isDragMode.current = false;
                }}
                contentContainerStyle={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    flexGrow: 1
                }}>
                {
                    students?.length === 0 ? 
                    <ListEmptyComponent />
                    :
                    students.map(item => (
                    <AttendanceItem
                        key={item.rollno}
                        item={item}
                        toggleAttendance={toggleAttendance}
                        onItemLayout={onItemLayout(item.rollno)}
                        onLongPress={longPressHandler}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default Attendance;
