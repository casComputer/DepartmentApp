import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ToastAndroid
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";

import Header from "@components/common/Header2.jsx";
import Select from "@components/common/Select.jsx";
import DueDate from "@components/common/DueDate.jsx";

import queryClient from "@utils/queryClient";

import { createAssignment } from "@controller/teacher/assignment.controller.js";

import { COURSES, YEAR } from "@constants/ClassAndCourses.js";

const AssignmentCreation = () => {
    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");
    const [year, setYear] = useState({});
    const [course, setCourse] = useState({});
    const [date, setDate] = useState();

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);

        if (!topic || !description || !year.id || !course.id || !date) {
            ToastAndroid.show("Please fill all fields", ToastAndroid.LONG);
            setSaving(false);
            return;
        }

        const assignmentData = {
            topic,
            description,
            year: year.id,
            course: course.id,
            dueDate: date
        };

        const result = await createAssignment(assignmentData);
        console.log(result);
        if (result.success) {
            queryClient.setQueryData(["assignments"], prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    pages: prev.pages.map(page => ({
                        ...page,
                        assignments: [result.assignment, ...page.assignments]
                    }))
                };
            });
        }
        setSaving(false);
        router.back();
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ paddingBottom: 70 }}
            className="grow bg-primary">
            <Header title="Assignments" onSave={handleSave} saving={saving} />

            <View className="px-2 mt-4">
                <TextInput
                    className="mt-5 py-7 px-5 rounded-3xl font-semibold text-xl border text-text dark:border-zinc-500"
                    placeholderTextColor="rgb(119,119,119)"
                    placeholder="Assignment Topic"
                    value={topic}
                    onChangeText={setTopic}
                />
                <TextInput
                    className="mt-5 py-7 px-5 rounded-3xl font-semibold text-xl border text-text dark:border-zinc-500"
                    placeholderTextColor="rgb(119,119,119)"
                    placeholder="Description"
                    multiline={true}
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                />
                <Select
                    options={YEAR}
                    title={"year"}
                    select={setYear}
                    selected={year}
                />
                <Select
                    options={COURSES}
                    title={"course"}
                    select={setCourse}
                    selected={course}
                />

                <DueDate date={date} onChange={setDate} />
            </View>
        </KeyboardAwareScrollView>
    );
};

export default AssignmentCreation;
 