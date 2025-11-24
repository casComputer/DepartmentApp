import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

import Header from "@components/common/Header.jsx";
import StudentItem from "@components/common/UserItem.jsx";
import {
    ListEmptyComponent,
    ListHeaderComponent
} from "@components/teacher/ManageStudentList.jsx";

import {
    fetchStudentsByClassTeacher,
    verifyMultipleStudents
} from "@controller/teacher/students.controller.js";

import { useAppStore } from "@store/app.store.ts";
import { useTeacherStore } from "@store/teacher.store.js";

const handlePress = item => {
    if (item)
        router.push({
            pathname: "/(teacher)/(others)/VerifyStudent",
            params: {
                username: item.studentId,
                fullname: item.fullname,
                isVerified: item.is_verified
            }
        });
};

const ManageStudents = () => {
    const [status, setStatus] = useState("LOADING");
    const [show, setShow] = useState(false);
    const teacherId = useAppStore(state => state.user?.userId);
    const students = useTeacherStore(state => state.students);
    const inChargeCourse = useTeacherStore(state => state.inCharge.course);
    const inChargeYear = useTeacherStore(state => state.inCharge.year);

    useEffect(() => {
        if (teacherId) fetchStudentsByClassTeacher({ teacherId, setStatus });
    }, [teacherId]);

    useEffect(() => {
        const t = setTimeout(function () {
            setShow(true);
        }, 50);

        return () => clearTimeout(t);
    }, []);

    const handleVerifyAll = () => {
        verifyMultipleStudents(students);
    };

    const safeData = Array.isArray(students) ? students : [];
    // const safeStudents = useMemo(() => students, []);

    return (
        <View className={" pt-12 flex-1 bg-white"}>
            <Header title={"Manage Students"} />

            <FlashList
                data={show ? safeData : []}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.studentId.toString()}
                className={"px-3 py-8"}
                contentContainerStyle={{ paddingBottom: 60 }}
                renderItem={({ item }) => (
                    <StudentItem
                        item={item}
                        handlePress={handlePress}
                        highlight={!item.rollno || item.rollno == 0}
                    />
                )}
                ListHeaderComponent={
                    <ListHeaderComponent
                        loading={status === "LOADING"}
                        year={inChargeYear}
                        course={inChargeCourse}
                        handleVerifyAll={handleVerifyAll}
                    />
                }
                ListEmptyComponent={<ListEmptyComponent status={status} />}
            />
        </View>
    );
};

export default ManageStudents;
