import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@icons";

import Header from "@components/common/Header2.jsx";
import Select from "@components/common/Select.jsx";
import GlobalProgress from "@components/common/GlobalProgress.jsx";

import { toast, useAppStore } from "@store/app.store.js";
import { handleDocumentPick, handleUpload } from "@utils/file.upload.js";
import { createNotice } from "@controller/admin/notice.controller.js";
import { YEAR, COURSES } from "@constants/ClassAndCourses.js";

const TARGET_OPTIONS = [
    { id: "all", title: "Everyone" },
    { id: "teacher", title: "Teachers" },
    { id: "student", title: "Students" },
    { id: "parent", title: "Parents" },
    { id: "class", title: "Specific Class" }
];

const TargetChip = ({ item, selected, onPress }) => (
    <TouchableOpacity
        onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress(item);
        }}
        className={`px-5 py-3 rounded-full border mr-2 mb-2 ${
            selected
                ? "bg-card-selected border-blue-500"
                : "bg-card border-border"
        }`}>
        <Text
            className={`font-bold text-base ${selected ? "text-blue-500" : "text-text"}`}>
            {item.title}
        </Text>
    </TouchableOpacity>
);

const SendNotice = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [target, setTarget] = useState(null);
    const [year, setYear] = useState({});
    const [course, setCourse] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [saving, setSaving] = useState(false);

    const setProgress = useAppStore.getState().setGlobalProgress;

    const handlePickImage = async () => {
        const file = await handleDocumentPick(["image/*"]);
        if (file) setImageFile(file);
    };

    const handleRemoveImage = () => setImageFile(null);

    const handleSave = async () => {
        if (!title.trim()) {
            toast.warn("Missing Title", "Please enter a notice title.");
            return;
        }
        if (!target) {
            toast.warn("Missing Audience", "Please select a target audience.");
            return;
        }
        if (target.id === "class" && (!year?.id || !course?.id)) {
            toast.warn("Missing Class", "Please select year and course.");
            return;
        }

        setSaving(true);
        let uploadedImage = null;
        let uploadedPublicId = null;

        if (imageFile) {
            const result = await handleUpload(imageFile, "notice");
            if (!result.success) {
                setSaving(false);
                return;
            }
            uploadedImage = result.secure_url;
            uploadedPublicId = result.public_id;
        }

        setProgress(0);

        await createNotice({
            title: title.trim(),
            description: description.trim() || undefined,
            image: uploadedImage,
            imagePublicId: uploadedPublicId,
            target: target.id,
            year,
            course
        });

        setSaving(false);
        router.back();
    };

    return (
        <View className="flex-1 bg-primary">
            <GlobalProgress />
            <KeyboardAwareScrollView
                contentContainerStyle={{ paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
                className="px-2 mt-4">
                <Header onSave={handleSave} saving={saving} />

                {/* Title */}
                <TextInput
                    className="mt-12 py-6 px-5 rounded-3xl font-semibold text-xl border text-text border-border bg-card"
                    placeholderTextColor="rgb(119,119,119)"
                    placeholder="Notice Title"
                    value={title}
                    onChangeText={setTitle}
                />

                {/* Description */}
                <TextInput
                    className="mt-4 py-6 px-5 rounded-3xl font-semibold text-base border text-text border-border bg-card"
                    placeholderTextColor="rgb(119,119,119)"
                    placeholder="Description (optional)"
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    value={description}
                    onChangeText={setDescription}
                    style={{ minHeight: 120 }}
                />

                {/* Target Audience */}
                <View className="mt-4 px-2 py-4 bg-card border border-border rounded-3xl">
                    <Text className="text-[6vw] px-3 font-bold mb-3 text-text">
                        Target Audience:
                    </Text>
                    <View className="flex-row flex-wrap px-2">
                        {TARGET_OPTIONS.map(opt => (
                            <TargetChip
                                key={opt.id}
                                item={opt}
                                selected={target?.id === opt.id}
                                onPress={setTarget}
                            />
                        ))}
                    </View>
                </View>

                {/* Class selectors – only when target is "class" */}
                {target?.id === "class" && (
                    <>
                        <Select
                            options={YEAR}
                            title="year"
                            select={setYear}
                            selected={year}
                        />
                        <Select
                            options={COURSES}
                            title="course"
                            select={setCourse}
                            selected={course}
                        />
                    </>
                )}

                {/* Image upload */}
                <View className="mt-4 bg-card border border-border rounded-3xl px-4 py-5">
                    <Text className="text-[5.5vw] font-bold text-text mb-3">
                        Attach Image (optional)
                    </Text>

                    {imageFile ? (
                        <View className="items-center gap-3">
                            <View className="w-full h-52 rounded-2xl overflow-hidden bg-card-selected">
                                <Image
                                    source={{ uri: imageFile.uri }}
                                    style={{ width: "100%", height: "100%" }}
                                    resizeMode="cover"
                                />
                            </View>
                            <TouchableOpacity
                                onPress={handleRemoveImage}
                                className="flex-row items-center gap-2 py-3 px-5 rounded-full border border-red-500">
                                <MaterialIcons
                                    name="delete-outline"
                                    size={20}
                                    color="rgb(239,68,68)"
                                />
                                <Text className="text-red-500 font-bold text-base">
                                    Remove Image
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={handlePickImage}
                            className="border-2 border-dashed border-border rounded-2xl py-10 items-center gap-2">
                            <MaterialIcons
                                name="add-photo-alternate"
                                size={36}
                                color="rgb(119,119,119)"
                            />
                            <Text className="text-text/60 font-semibold text-base">
                                Tap to select image
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default SendNotice;
