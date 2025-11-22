import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

import Header from "@components/common/Header.jsx";
import StudentItem from "@components/common/UserItem.jsx";

import { fetchStudentsByClassTeacher } from "@controller/teacher/students.controller.js";

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
    const teacherId = useAppStore(state => state.user?.userId);
    const students = useTeacherStore(state => state.students);
    const inChargeCourse = useTeacherStore(state => state.inCharge.course);
    const inChargeYear = useTeacherStore(state => state.inCharge.year);

    useEffect(() => {
        fetchStudentsByClassTeacher({ teacherId, setStatus });
    }, []);

    if (status === "LOADING" && students.length === 0)
        return (
            <Text className="text-2xl font-black pt-14 text-center">
                Loading...
            </Text>
        );

    if (status === "ERROR")
        return (
            <Text className="text-2xl font-black pt-14 text-center">
                Something Went Wrong!, Try again later.
            </Text>
        );

    if (status === "CLASS_EMPTY")
        return (
            <Text className="text-2xl font-black pt-14 text-center">
                No Students Yet !
            </Text>
        );

    if (status === "NO_CLASS_ASSIGNED")
        return (
            <Text className="text-2xl font-black pt-14 text-center">
                You are not assigned to any class !
            </Text>
        );

    return (
        <View className={" pt-12 flex-1"}>
            <Header title={"Manage Students"} />
            <Text className="text-3xl font-bold px-5 my-8">
                {inChargeYear} {inChargeCourse}
            </Text>
            <FlashList
                data={students}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.studentId.toString()}
                className={"px-3"}
                contentContainerStyle={{ paddingBottom: 60 }}
                renderItem={({ item }) => (
                    <StudentItem item={item} handlePress={handlePress} />
                )}
            />
        </View>
    );
};

export default ManageStudents;
