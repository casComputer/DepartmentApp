import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { router } from "expo-router";

export const CoursePrompt = ({ setShowCoursePrompt }) => {
    return (
        <View className="absolute z-50 top-0 left-0 w-full h-full px-3 justify-center ">
            <View className="w-full pt-8 pb-8 rounded-3xl bg-card px-4">
                <TextInput
                    className="px-4 py-5 rounded-xl text-text font-bold border border-text-secondary"
                    autoFocus
                    onSubmitEditing={() => alert()}
                    onBlur={() => setShowCoursePrompt(false)}
                />
                <View className="flex-row justify-between items-center px-5 mt-8">
                    <TouchableOpacity onPress={() => setShowCoursePrompt(false)}>
                        <Text className="text-xl font-bold text-red-500">
                            Cancel
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text className="text-xl font-bold text-green-500">
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export const TeacherOptions = ({ setShowCoursePrompt }) => {
    return (
        <View className="px-2">
            <TouchableOpacity
                onPress={() => router.push('/common/profile/AddCourse')}
                className="py-4 rounded-3xl items-center justify-center bg-btn"
            >
                <Text className="text-xl font-bold text-text text-center">
                    Add Your Course
                </Text>
            </TouchableOpacity>
        </View>
    );
};
