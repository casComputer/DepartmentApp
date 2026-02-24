import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import Header from "@components/common/Header.jsx";
import Select from "@/components/common/Select.jsx";

import { YEAR, COURSES } from "@constants/ClassAndCourses";

const Selector = () => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const handleProceed = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (selectedClass?.id && selectedCourse?.id) {
            router.push({
                pathname: "/common/fees/Fees",
                params: {
                    year: selectedClass.id,
                    course: selectedCourse.id
                }
            });
        }
    };
    
    const handleRouteToHistory = ()=>{
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push("/common/fees/History")
    }

    return (
        <View className="flex-1 bg-primary">
            <Header
                title="Fees"
                extraButton={true}
                buttonTitle={"History"}
                handlePress={handleRouteToHistory}
            />

            <View className="px-2 mt-16"  >
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
                className="mt-3 rounded-3xl p-6 justify-center items-center"
            >
                <Text className="text-[6vw] font-black text-text">Proceed</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Selector;
