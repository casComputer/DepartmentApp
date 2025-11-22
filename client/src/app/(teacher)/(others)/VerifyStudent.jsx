import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Alert } from "react-native";

import {
    verifyStudent,
    cancelStudentVerification
} from "@controller/teacher/students.controller.js";

import { useTeacherStore } from "@store/teacher.store.js";

const Header = () => (
    <TouchableOpacity
        className="flex-row items-center"
        onPress={() => router.back()}>
        <MaterialIcons
            name="arrow-back-ios-new"
            size={22}
            color="rgb(59, 130, 246)"
        />
        <Text className="text-blue-500 font-semibold text-[7vw] justify-center">
            Back
        </Text>
    </TouchableOpacity>
);

const VerifyStudent = () => {
    const { username, fullname } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const is_verified = useTeacherStore(
        state => state.students.find(s => s.studentId === username)?.is_verified
    );
    const rollno = useTeacherStore(
        state => state.students.find(s => s.studentId === username)?.rollno
    );

    const handleCancelVerification = () => {
        if (loading) return;

        Alert.alert(
            "Confirm",
            "Are you sure to delete the user?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "OK",
                    onPress: () => {
                        cancelStudentVerification({ studentId: username });
                    }
                }
            ],
            { cancelable: true }
        );
    };
    const handleVerification = async () => {
        if (loading) return;
        verifyStudent({ studentId: username });
    };

    if (!username) {
        return (
            <View className="flex-1 pt-12 px-3 bg-zinc-100">
                <Text className="text-center text-gray-900 text-xl mt-1">
                    Student not found
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 pt-12 px-3 bg-zinc-100">
            <Header />

            {/* Image */}
            <TouchableOpacity className="w-[60vw] h-[60vw] rounded-full bg-green-400 self-center mt-10 justify-center items-center">
                <Text className="text-[40vw] font-black text-center text-black">
                    {fullname?.slice(0, 1)}
                </Text>
            </TouchableOpacity>

            <Text className="text-center text-gray-900 text-xl mt-1">
                @{username}
            </Text>

            <View className="w-full h-[8%] rounded-full border-black border mt-5">
                <TextInput
                    className="text-black w-full h-full font-bold text-[5vw] px-5"
                    value={fullname}
                    editable={false}
                />
            </View>
            <View className="w-full h-[8%] rounded-full border-black border mt-5">
                <TextInput
                    className="text-black w-full h-full font-bold text-[5vw] px-5"
                    value={rollno}
                />
            </View>

            <View className="flex-1 justify-center items-end flex-row gap-3 py-20">
                <TouchableOpacity
                    onPress={handleCancelVerification}
                    className="flex-1 bg-red-500 rounded-3xl justify-center items-center py-6">
                    <Text className="text-xl font-bold">Remove</Text>
                </TouchableOpacity>
                {!is_verified && (
                    <TouchableOpacity
                        onPress={handleVerification}
                        className="flex-1 bg-green-500 rounded-3xl justify-center items-center py-6">
                        <Text className="text-xl font-bold">Verify</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default VerifyStudent;
