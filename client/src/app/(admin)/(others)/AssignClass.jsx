import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@icons";
import { router, useLocalSearchParams } from "expo-router";

import { YEAR, COURSES } from "@constants/ClassAndCourses";
import { assignClass } from "@controller/admin/teachers.controller";

import { useAdminStore } from "@store/admin.store.js";
import Select from "@components/common/Select";
import Header from "@components/common/Header";

const AssignClass = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    let { userId } = useLocalSearchParams();

    const user = useAdminStore((state) =>
        state.teachers.find((t) => t.teacherId === userId)
    );

    const handleAssignClass = () => {
        if (selectedClass && selectedCourse && user && user.teacherId) {
            assignClass({
                year: selectedClass,
                course: selectedCourse,
                teacherId: user.teacherId,
            });
        }
    };

    return (
        <View className="flex-1 bg-primary">
            <Header title="Assign Class" />

            <View className="px-2">
                <Select
                    title="Course"
                    options={COURSES}
                    select={setSelectedCourse}
                    selected={selectedCourse}
                />
                <Select
                    title="Year"
                    options={YEAR}
                    select={setSelectedClass}
                    selected={selectedClass}
                />

                <TouchableOpacity
                    onPress={handleAssignClass}
                    className="w-full bg-btn p-6 justify-center items-center rounded-3xl mt-5"
                >
                    <Text className="text-[6vw] font-black text-text">
                        Assign
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AssignClass;
