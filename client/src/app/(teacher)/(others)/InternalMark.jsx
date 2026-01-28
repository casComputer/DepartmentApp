import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
} from "react-native";

import Header from "@components/common/Header2.jsx";
import Select from "@components/common/Select.jsx";

import {
    handleSave,
    checkExists,
} from "@controller/teacher/internal.controller.js";

import { handleDocumentPick, handleUpload } from "@utils/file.upload.js";

import { useAppStore } from "@store/app.store.js";

import { COURSES, SEM } from "@constants/ClassAndCourses";

const setProgress = useAppStore.getState().setGlobalProgress;
const setProgressText = useAppStore.getState().setGlobalProgressText;

const InternalMark = () => {
    const [selectedCourse, setSelectedCourse] = useState({});
    const [selectedSem, setSelectedSem] = useState({});
    const [file, setFile] = useState({});

    const handleSelectFile = async () => {
        const asset = await handleDocumentPick(["application/pdf", "image/*"]);
        if (asset) setFile(asset);
    };

    const handdleUploadFile = async () => {
        try {
            if (!selectedCourse.id || !selectedSem.id) {
                ToastAndroid.show(
                    "Please select all fields.",
                    ToastAndroid.SHORT,
                );
                return;
            }

            if (!file || !file.name) {
                ToastAndroid.show("Please select a file.", ToastAndroid.SHORT);
                return;
            }

            setProgress(1);
            setProgressText("Checking Previous Uploads..");

            const { uploaded, failed } = await checkExists(
                selectedCourse.id,
                selectedSem.id,
            );

            if (failed || uploaded) return;

            setProgressText("Uploading File..");

            const { secure_url, format, success, public_id } =
                await handleUpload(file, "internal_mark");

            if (!success) return;

            const data = {
                course: selectedCourse.id,
                sem: selectedSem.id,
                filename: file.name,
                secure_url,
                format,
                public_id,
            };

            setProgressText("Saving internal marks details..");
            await handleSave(data);
        } catch (error) {
        } finally {
            setProgress(0);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
            className="bg-primary"
        >
            <Header onSave={handdleUploadFile} />

            <View className="px-1">
                <Select
                    title="Course"
                    options={COURSES}
                    select={setSelectedCourse}
                    selected={selectedCourse}
                />
                <Select
                    title="Semester"
                    options={SEM}
                    select={setSelectedSem}
                    selected={selectedSem}
                />
            </View>
            {file?.name ? (
                <View className="mt-5 px-2">
                    <Text className="text-text-secondary font-bold text-center text-lg ">
                        Selected File: {file.name}
                    </Text>
                </View>
            ) : (
                <TouchableOpacity onPress={handleSelectFile}>
                    <Text className="text-2xl font-black text-blue-500 text-center mt-5">
                        Select File
                    </Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

export default InternalMark;
