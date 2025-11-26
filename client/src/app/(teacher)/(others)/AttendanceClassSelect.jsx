import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";

import Header from "@components/common/Header";
import Select from "@/components/common/Select";

import { YEAR, COURSES } from "@constants/ClassAndCourses";

const Attendance = () => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const handleProceed = () => {
        if (selectedClass && selectedCourse) {
            router.push({
                pathname: "/(teacher)/(others)/Attendance",
                params: {
                    year: selectedClass.id,
                    course: selectedCourse.id
                }
            });
        }
    };

    return (
        <ScrollView className="flex-1 py-12" contentContainerStyle={{ paddingBottom:  100,}}>
            <Header title="Attendance" />
            <TouchableOpacity
                onPress={() => router.push('/(teacher)/(others)/AttendanceHistory')}
                className="mt-4 ml-5">
                <Text className="text-2xl text-blue-500 font-bold">History</Text>
            </TouchableOpacity>
            <View className="px-5 mt-5">
                <Select
                    title="Year"
                    options={YEAR}
                    select={setSelectedClass}
                    selected={selectedClass}
                />
                <Select
                    title="Class"
                    options={COURSES}
                    select={setSelectedCourse}
                    selected={selectedCourse}
                />
            </View>

            <TouchableOpacity
                onPress={handleProceed}
                className="mt-3 rounded-3xl p-6 justify-center items-center">
                <Text className="text-[6vw] font-black">Proceed</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Attendance;
