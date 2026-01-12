import { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ToastAndroid
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Entypo } from "@icons";
import * as Haptics from "expo-haptics";

import Header from "@components/common/Header.jsx";
import Select from "@components/common/Select.jsx";

import { COURSES, YEAR } from "@constants/ClassAndCourses.js";

const AddCourse = () => {
    const [year, setYear] = useState(null);
    const [course, setCourse] = useState(null);
    const [courseName, setCourseName] = useState(null);
    const [list, setList] = useState([]);

    const inputRef = useRef(null);

    const checkFields = () => {
        if (!year || !course || !courseName) {
            ToastAndroid.show(
                "Please fill all the field before continuing...",
                ToastAndroid.SHORT
            );
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (!checkFields()) return;
    };

    const handleAdd = () => {
        if (!checkFields()) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        setList(prev => [
            ...prev,
            {
                course,
                year,
                courseName: courseName?.trim().toUpperCase(),
                id: prev?.length
            }
        ]);
        setCourseName("");
        setCourse(null);
        setYear(null);
    };

    const handleRemove = id => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setList(prev => [...prev.filter(item => item.id !== id)]);
    };

    useEffect(() => {
        if (course && year && course?.id && year?.id)
            inputRef?.current?.focus();
    }, [course, year, inputRef]);

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ paddingBottom: 100 }}
            className="bg-primary"
        >
            <Header title={"Add Course"} />
            <View className="px-2">
                <Select
                    title="Year"
                    options={YEAR}
                    selected={year}
                    select={setYear}
                />
                <Select
                    title="Course"
                    options={COURSES}
                    selected={course}
                    select={setCourse}
                />
                <TextInput
                    ref={inputRef}
                    className="mt-4 px-4 py-5 rounded-3xl text-text font-bold border border-text-secondary"
                    value={courseName}
                    autoFocus
                    placeholder={"enter course name"}
                    onSubmitEditing={handleAdd}
                    onChangeText={setCourseName}
                />
                <View className="flex-wrap flex-row items-center gap-2 mt-5">
                    {list?.map((item, index) => (
                        <View
                            key={`${item.course}-${item.id}-${item.year}-${item.courseName}`}
                            className="px-2 py-2 bg-pink-600 rounded-full flex-row justify-between max-w-full items-center gap-1 overflow-hidden"
                        >
                            <TouchableOpacity
                                onPress={() => handleRemove(item.id)}
                            >
                                <Entypo name="cross" size={22} />
                            </TouchableOpacity>

                            <Text
                                numberOfLines={1}
                                className="max-w-full text-text font-bold text-sm text-center"
                            >
                                {item.year.id} {item.course.id}{" "}
                                {item.courseName}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
            <View className="flex-1 justify-end py-8">
                <TouchableOpacity onPress={handleAdd}>
                    <Text className="mt-8 text-2xl font-bold text-blue-500 text-center my-3">
                        Add Another
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave}>
                    <Text className="text-2xl font-bold text-green-500 text-center my-3">
                        Save
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default AddCourse;
