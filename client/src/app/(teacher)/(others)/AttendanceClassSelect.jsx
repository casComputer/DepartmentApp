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
        if (selectedClass && selectedCourse && selectedHour) {
            router.push({
                pathname: "/(teacher)/(others)/Attendance",
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
            contentContainerStyle={{ paddingBottom: 100, flexGrow: 1, }}>
            <Header
                title="Attendance"
                extraButton={true}
                buttonTitle={"History"}
                handlePress={() =>
                    router.push("/(teacher)/(others)/AttendanceHistory")
                }
            />

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
                <Select
                    title="Hour"
                    options={HOURS}
                    select={setSelectedHour}
                    selected={selectedHour}
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
