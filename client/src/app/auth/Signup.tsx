import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import { useAppStore } from "../../store/app.store";
import handleSignup from "../../controller/auth/signup.controller.js";

import StudentExtra from "../../components/auth/StudentExtra.jsx";

const Signup = () => {
    const userRole = useAppStore.getState().user?.role;
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [year, setYear] = useState("");
    const [course, setCourse] = useState("");

    const theme = useColorScheme();

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            className="bg-white flex-grow h-[150vh] dark:bg-black"
        >
            {/* BACKGROUND */}

            {theme === "light" && (
                <LinearGradient
                    colors={[
                        "rgba(46,217,177,0.6)",
                        "rgba(46,217,177,0.3)",
                        "rgba(46,217,177,0.1)"
                    ]}
                    className="w-full h-full absolute top-0 left-0"
                />
            )}

            <Text className="text-black font-bold text-[20vw] px-5 mt-28 dark:text-white">
                Signup
            </Text>

            {/* Form */}
            <View className="flex-1 gap-5 mt-24 px-4">
                <TextInput
                    className="text-black border font-semibold border-black rounded-[26px] overflow-hidden px-5 py-7 text-2xl dark:text-white dark:border-white"
                    placeholder="username"
                    autoCapitalize="none"
                    placeholderTextColor="rgb(119,119,119)"
                    onChangeText={setUsername}
                    value={username}
                />

                <TextInput
                    className="text-black border font-semibold border-black rounded-[26px] overflow-hidden px-5 py-7 text-2xl dark:text-white dark:border-white"
                    placeholder="fullname"
                    placeholderTextColor="rgb(119,119,119)"
                    onChangeText={setFullName}
                    value={fullName}
                />

                <TextInput
                    className="text-black font-semibold border border-black rounded-[26px] overflow-hidden px-5 py-7 text-2xl dark:text-white dark:border-white"
                    placeholder="password"
                    placeholderTextColor="rgb(119,119,119)"
                    autoCapitalize="none"
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry
                />

                {userRole === "student" && (
                    <StudentExtra
                        year={year}
                        setYear={setYear}
                        course={course}
                        setCourse={setCourse}
                    />
                )}
            </View>

            {/* Buttons */}
            <View className="px-5 mt-10 mb-20">
                <TouchableOpacity
                    className="bg-green-400 py-5 w-full rounded-3xl"
                    onPress={() =>
                        handleSignup({
                            username,
                            password,
                            fullName,
                            userRole,
                            course,
                            year
                        })
                    }
                >
                    <Text className="text-white font-black text-3xl text-center">
                        Sign Up
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.replace("/auth/Signin")}
                >
                    <Text className="text-black text-2xl text-center font-bold mt-3 dark:text-white">
                        Already have an account? SignIn
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Signup;
