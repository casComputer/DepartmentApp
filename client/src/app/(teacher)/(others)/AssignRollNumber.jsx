import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from "react-native";

import Header from "@components/common/Header2.jsx";
import Info from "@components/common/InfoBox.jsx";
import Grouping from "@components/teacher/RollGroup.jsx";

import { assignRollAlphabetically } from "@controller/teacher/students.controller.js";
import { useTeacherStore } from "@store/teacher.store.js";
import confirm from "@utils/confirm.js";

const infoText = "Note: Auto-assigning will reset existing roll numbers.";

const AssignRoleNumber = () => {
    const inCharge = useTeacherStore(state => state.inCharge);
    const getVerifiedStudents = useTeacherStore(
        state => state.getVerifiedStudents
    );
    const students = getVerifiedStudents();
    const [loading, setLoading] = useState(false);

    const handleAlphebetic = () => {
        confirm(
            `Auto-assign roll numbers for ${students.length} students? Existing roll numbers will be overwritten.`,
            async () => {
                setLoading(true);
                await assignRollAlphabetically({
                    course: inCharge.course,
                    year: inCharge.year
                });
                setLoading(false);
            }
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
            className="pt-12 px-3 bg-white "
        >
            <Header />

            {loading && <ActivityIndicator size="large" color="#000" />}

            <Info text={infoText} />

            <TouchableOpacity
                onPress={handleAlphebetic}
                className="w-full justify-center items-center py-7 rounded-full bg-emerald-500  mt-3"
            >
                <Text className="text-white text-2xl font-bold">
                    Alphabetical Order
                </Text>
            </TouchableOpacity>

            <Text className="text-2xl font-semibold text-center my-8">OR</Text>

            <Grouping
                students={students}
                inCharge={inCharge}
                setLoading={setLoading}
            />
        </ScrollView>
    );
};

export default AssignRoleNumber;
