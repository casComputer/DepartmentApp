import { useState } from "react";
import {
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { withUniwind } from "uniwind";

import Header from "@components/common/Header2.jsx";
import Info from "@components/common/InfoBox.jsx";
import Grouping from "@components/teacher/RollGroup.jsx";

import { assignRollAlphabetically } from "@controller/teacher/students.controller.js";

import { useTeacherStore } from "@store/teacher.store.js";
import { useAppStore } from "@store/app.store.js";

import confirm from "@utils/confirm.js";

const StyledActivityIndicator = withUniwind(ActivityIndicator);
const infoText = "Note: Auto-assigning will reset existing roll numbers.";

const AssignRoleNumber = () => {
    const inChargeYear = useAppStore(state => state.user.in_charge_year);
    const inChargeCourse = useAppStore(state => state.user.in_charge_course);

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
                    course: inChargeCourse,
                    year: inChargeYear
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
            className="px-3 bg-primary">
            <Header />

            {loading && (
                <StyledActivityIndicator
                    size="large"
                    className="text-text"
                />
            )}

            <Info text={infoText} />

            <TouchableOpacity
                onPress={handleAlphebetic}
                className="w-full justify-center items-center py-7 rounded-full bg-btn  mt-3">
                <Text className="text-text text-2xl font-bold">
                    Alphabetical Order
                </Text>
            </TouchableOpacity>

            <Text className="text-2xl font-semibold text-center my-8 text-text">
                OR
            </Text>

            <Grouping
                students={students}
                inCharge={{ course: inChargeCourse, year: inChargeYear }}
                setLoading={setLoading}
            />
        </ScrollView>
    );
};

export default AssignRoleNumber;
