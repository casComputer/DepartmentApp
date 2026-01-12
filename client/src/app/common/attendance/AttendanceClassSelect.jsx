import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";

import Header from "@components/common/Header";
import Select from "@/components/common/Select";

import { YEAR, COURSES, HOURS } from "@constants/ClassAndCourses";

const Attendance = () => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedHour, setSelectedHour] = useState(null);

    const handleProceed = () => {
        if (selectedClass?.id && selectedCourse?.id && selectedHour?.id) {
            router.push({
                pathname: "/common/attendance/Attendance",
                params: {
                    year: selectedClass.id,
                    course: selectedCourse.id,
                    hour: selectedHour.id
                }
            });
        }
    };

    return (
        <ScrollView
            className="bg-primary"
            contentContainerStyle={{ paddingBottom: 70, flexGrow: 1 }}
        >
            <Header title="Attendance" />

            <View className="flex-row justify-between items-center px-4 mt-2">
                <TouchableOpacity>
                    <Text className="text-2xl text-blue-500 font-black">
                        Class History
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() =>
                        router.push("/common/attendance/AttendanceHistory")
                    }
                >
                    <Text className="text-2xl text-blue-500 font-black">
                        My History
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="px-2 mt-2">
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
                <Select
                    title="Hour"
                    options={HOURS}
                    select={setSelectedHour}
                    selected={selectedHour}
                />
            </View>

            <TouchableOpacity
                onPress={handleProceed}
                className="mt-3 rounded-3xl p-6 justify-center items-center"
            >
                <Text className="text-[6vw] font-black text-text">Proceed</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Attendance;
