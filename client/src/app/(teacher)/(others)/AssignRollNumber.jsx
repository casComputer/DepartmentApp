import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import Header from "@components/common/Header2.jsx";
import Info from "@components/common/InfoBox.jsx";
import Grouping from "@components/teacher/RollGroup.jsx";

import { assignRollAlphabetically } from "@controller/teacher/students.controller.js";
import { useTeacherStore } from "@store/teacher.store.js";
import confirm from "@utils/confirm.js";

const infoText = "Note: Auto-assigning may reset existing roll numbers.";

const AssignRoleNumber = () => {
    const inCharge = useTeacherStore(state => state.inCharge);
    const students = useTeacherStore(state => state.students);

    const handleAlphebetic = () => {
        confirm(
            `Auto-assign roll numbers for ${students.length} students? Existing roll numbers will be overwritten.`,
            () =>
                assignRollAlphabetically({
                    course: inCharge.course,
                    year: inCharge.year
                })
        );
    };

    return (
        <ScrollView
            bounces={true}
            alwaysBounceVertical={true}
            overScrollMode="always"
            contentContainerStyle={{
                paddingBottom: 70
            }}
            className="pt-12 px-3 bg-white ">
            <Header />
            <Info text={infoText} />

            <TouchableOpacity
                onPress={handleAlphebetic}
                className="w-full justify-center items-center py-7 rounded-full bg-emerald-500  mt-10">
                <Text className="text-white text-2xl font-bold">
                    Alphabetical Order
                </Text>
            </TouchableOpacity>

            <Text className="text-2xl font-semibold text-center my-5">OR</Text>

            <Grouping students={students} />
        </ScrollView>
    );
};

export default AssignRoleNumber;
