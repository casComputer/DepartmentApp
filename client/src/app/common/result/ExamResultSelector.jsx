import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
} from "react-native";
import { router } from "expo-router";

import Header from "@components/common/Header2.jsx";
import Select from "@components/common/Select.jsx";

import { COURSES, SEM } from "@constants/ClassAndCourses";

const ExamResult = () => {
    const [selectedCourse, setSelectedCourse] = useState({});
    const [selectedSem, setSelectedSem] = useState({});

    const handlePress = async () => {
        if (!selectedCourse.id || !selectedSem.id) {
            ToastAndroid.show("Please select all fields", ToastAndroid.LONG);
            return;
        }

        router.push({
            pathname: "/common/result/ExamResult",
            params: {
                course: selectedCourse.id,
                sem: selectedSem.id,
            },
        });
    };

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }} className="bg-primary">
            <Header />

            <View className="px-1">
                <Select
                    title="Course"
                    options={COURSES}
                    select={setSelectedCourse}
                    selected={selectedCourse}
                />
                <Select
                    title="Semester"
                    options={SEM}
                    select={setSelectedSem}
                    selected={selectedSem}
                />
            </View>

            <TouchableOpacity onPress={handlePress}>
                <Text className="text-2xl font-bold text-center text-blue-500 py-2 mt-5">
                    Proceed
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default ExamResult;
