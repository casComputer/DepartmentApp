import { useState } from "react";
import {  TextInput, ToastAndroid } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import Header from "@components/common/Header2.jsx";
import Select from "@components/common/Select.jsx";

import { COURSES, YEAR } from "@constants/ClassAndCourses.js";

import { create } from "@controller/teacher/notes.controller.js";

const CreateNote = () => {
    const [folder, setFolder] = useState("");
    const [year, setYear] = useState({});
    const [course, setCourse] = useState({});
    const [saving, setSaving] = useState(false);

    const { parentId } = useLocalSearchParams();

    const handleSave = async () => {
        setSaving(true);
        if (!folder || (!parentId && (!year?.id || !course?.id))) {
            ToastAndroid.show(
                "Please fill all fields before submission!",
                ToastAndroid.SHORT
            );
        } else {
            const data = {
                name: folder,
                course: course.id || "",
                year: year.id || "",
                type: "folder",
                parentId: parentId || null
            };

            await create(data);
            router.back();
        }
        setSaving(false);
    };

    return (
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} className="bg-primary">
            <Header onSave={handleSave} saving={saving} />

            <TextInput
                className="mt-8 py-7 px-5 rounded-3xl font-semibold text-xl text-text border dark:border-zinc-500"
                placeholderTextColor="rgb(119,119,119)"
                placeholder="Folder name"
                value={folder}
                onChangeText={setFolder}
            />

            {!parentId && (
                <>
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
                </>
            )}
        </KeyboardAwareScrollView>
    );
};

export default CreateNote;
