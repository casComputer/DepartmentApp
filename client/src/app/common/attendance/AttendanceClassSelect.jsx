import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";

import * as Haptics from "expo-haptics";

import Header from "@components/common/Header";
import Select from "@/components/common/Select";

import { YEAR, COURSES, HOURS } from "@constants/ClassAndCourses";

import { useAppStore } from "@store/app.store.js";

const Attendance = () => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedHour, setSelectedHour] = useState(null);

    const isClassTeacher = useAppStore(
        state => !!(state.user.in_charge_year && state.user.in_charge_course)
    );
    const in_charge_year = useAppStore(state => state.user.in_charge_year);
    const in_charge_course = useAppStore(state => state.user.in_charge_course);

    const user = useAppStore(state => state.user);

    const handleProceed = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
        <View className="bg-primary flex-1">
            <Header
                title="Attendance"
                extraButton={!isClassTeacher}
                buttonTitle="History"
                handlePress={() =>
                    router.push("/common/attendance/AttendanceHistory")
                }
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="pt-16"
                contentContainerStyle={{ paddingBottom: 70, flexGrow: 1 }}
            >
                {isClassTeacher && (
                    <View className="flex-row justify-between items-center px-4 mt-2">
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname:
                                        "/common/attendance/AttendanceClassHistory",
                                    params: {
                                        year: in_charge_year,
                                        course: in_charge_course
                                    }
                                })
                            }
                        >
                            <Text className="text-2xl text-blue-500 font-black">
                                Class History
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>
                                router.push(
                                    "/common/attendance/AttendanceHistory"
                                )
                            }
                        >
                            <Text className="text-2xl text-blue-500 font-black">
                                My History
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

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
                    <Text className="text-[6vw] font-black text-text">
                        Proceed
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default Attendance;
