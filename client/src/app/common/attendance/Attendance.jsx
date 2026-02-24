import { useState, useEffect, useRef } from "react";
import { View, ToastAndroid, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
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
    const {
        course,
        year,
        hour,
        isEditable = true,
        date = new Date().toISOString().slice(0, 10)
    } = useLocalSearchParams();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const attendanceId = useRef(null);

    const storedCount =
        getStudentCount({
            course,
            year
        }) || 0;

    const [students, setStudents] = useState(
        Array.from(
            {
                length: storedCount
            },
            (_, i) => ({
                rollno: i + 1,
                present: false
            })
        )
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
        if (isEditable !== true) return;

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
        if (!course || !year || !hour) return;

        const loadStudents = async () => {
            try {
                setLoading(true);
                const {
                    students: newStudents = [],
                    attendance: existAttendance = []
                } = await fetchStudentsForAttendance({
                    course,
                    year,
                    hour,
                    date
                });

                attendanceId.current = existAttendance[0]?.attendanceId ?? null;

                const newStudentMap = new Map(
                    newStudents.map(s => [s.rollno, s])
                );

                const attendanceMap = new Map(
                    existAttendance.map(a => [a.rollno, a])
                );

                setStudents(prevStudents => {
                    const prevMap = new Map(
                        prevStudents.map(s => [s.rollno, s])
                    );

                    const attendanceMap = new Map(
                        existAttendance.map(a => [a.rollno, a])
                    );

                    if (existAttendance.length > 0) {
                        ToastAndroid.show(
                            "Attendance already exists. Local changes were reset.",
                            ToastAndroid.LONG
                        );

                        return newStudents.map(student => ({
                            ...student,
                            present:
                                attendanceMap.get(student.rollno)?.status ===
                                "present",
                            manuallyEdited: false
                        }));
                    }

                    if (newStudents.length !== storedCount) {
                        ToastAndroid.show(
                            "Student strength changed. Attendance reset.",
                            ToastAndroid.LONG
                        );

                        return newStudents.map(student => ({
                            ...student,
                            present: false,
                            manuallyEdited: false
                        }));
                    }

                    return newStudents.map(student => {
                        const prev = prevMap.get(student.rollno);

                        return {
                            ...student,
                            present: prev?.present ?? false,
                            manuallyEdited: prev?.manuallyEdited ?? false
                        };
                    });
                });
            } finally {
                setLoading(false);
            }
        };

        loadStudents();
    }, [course, year, hour, storedCount]);

    const toggleAttendance = rollno => {
        if (isEditable !== true) return;

        setStudents(prev =>
            prev.map(s =>
                s.rollno === rollno
                    ? {
                          ...s,
                          present: !s.present
                      }
                    : s
            )
        );
    };

    const handleSave = async () => {
        try {
            if (isEditable !== true) return;

            setSaving(true);
            await saveAttendance({
                students,
                course,
                year,
                hour,
                attendanceId: attendanceId?.current ?? null
            });
        } finally {
            setSaving(false);
        }
    };

    const longPressHandler = () => {
        if (isEditable !== true) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        isDragMode.current = true;
    };

    const handleSelectAll = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setStudents(prev => prev.map(item => ({ ...item, present: true })));
    };

    return (
        <View className="flex-1 bg-primary">
            <Header
                onSave={isEditable === true ? handleSave : undefined}
                saving={saving}
                disabled={loading}
            />

            <Options
                loading={loading}
                handleSelectAll={handleSelectAll}
                isEditable={isEditable}
            />

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
                }}
            >
                {students?.length === 0 ? (
                    <ListEmptyComponent />
                ) : (
                    students.map(item => (
                        <AttendanceItem
                            key={item.rollno}
                            item={item}
                            toggleAttendance={toggleAttendance}
                            onItemLayout={onItemLayout(item.rollno)}
                            onLongPress={longPressHandler}
                            isEditable={isEditable === true}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default Attendance;
