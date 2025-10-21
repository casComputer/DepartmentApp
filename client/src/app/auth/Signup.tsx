import { useState, useRef } from "react";
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
    const [message, setMessage] = useState({
        type: "",
        message: ""
    });

    const theme = useColorScheme();

    const usernameRef = useRef<TextInput>(null);
    const fullnameRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    const handleSubmit = async () => {
        if (username.trim()?.length <= 5) {
            setMessage({
                type: "error",
                message: "username is too short"
            });
            usernameRef.current?.setNativeProps({
                style: {
                    borderColor: "red"
                }
            });
            return;
        }

        if (fullName.trim()?.length <= 5) {
            setMessage({
                type: "error",
                message: "fullname is too short"
            });

            fullnameRef.current?.setNativeProps({
                style: {
                    borderColor: "red"
                }
            });
            return;
        }

        if (password.trim()?.length <= 5) {
            setMessage({
                type: "error",
                message: "password is too short"
            });

            passwordRef.current?.setNativeProps({
                style: {
                    borderColor: "red"
                }
            });
            return;
        }

        if (userRole === "student") {
            if (year === "") {
                return setMessage({
                    type: "error",
                    message: "select your year to continue"
                });
            }

            if (course === "") {
                return setMessage({
                    type: "error",
                    message: "select your course to continue"
                });
            }
        }

        setMessage({
            type: "info",
            message: "please wait..."
        });

        const { success, message: resMessage } = await handleSignup({
            username,
            password,
            fullName,
            userRole,
            course,
            year
        });

        setMessage({
            type: success ? "success" : "error",
            message: resMessage
        });
    };

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            className="bg-white dark:bg-black"
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

            <Text className="text-black font-bold text-[15vw] px-5 mt-20 dark:text-white">
                Signup
            </Text>

            {/* Form */}

            <View className="flex-1 gap-5 px-4 mt-5">
                <Text
                    className={`font-bold text-lg text-center ${
                        message.type === "error"
                            ? "text-red-500"
                            : message.type === "info"
                            ? "text-orange-500"
                            : "text-green-500"
                    }`}
                >
                    {message?.message}
                </Text>
                <TextInput
                    ref={usernameRef}
                    className={`text-bold border font-semibold rounded-[26px] overflow-hidden px-5 py-7 text-xl dark:text-white ${
                        username.trim().length > 5
                            ? "border-green-500"
                            : "border-black dark:border-white"
                    }`}
                    placeholder="username"
                    autoCapitalize="none"
                    placeholderTextColor="rgb(119,119,119)"
                    onChangeText={txt =>
                        setUsername(txt.replace(/[^a-zA-Z0-9._-]/g, ""))
                    }
                    value={username}
                />

                <TextInput
                    ref={fullnameRef}
                    placeholder="fullname"
                    className={`text-black border font-semibold rounded-[26px] overflow-hidden px-5 py-7 text-2xl dark:text-white ${
                        fullName?.trim()?.length > 5
                            ? "border-green-500"
                            : "border-black dark:border-white "
                    }`}
                    placeholderTextColor="rgb(119,119,119)"
                    onChangeText={setFullName}
                    value={fullName}
                />

                <TextInput
                    ref={passwordRef}
                    className={`text-black font-semibold border rounded-[26px] overflow-hidden px-5 py-7 text-2xl dark:text-white ${
                        password.length > 5
                            ? "border-green-500"
                            : "border-black dark:border-white"
                    }`}
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
            <View className="px-5 mt-3 mb-20">
                <TouchableOpacity
                    className="bg-green-400 py-5 w-full rounded-3xl"
                    onPress={handleSubmit}
                >
                    <Text className="text-white font-black text-3xl text-center">
                        Sign Up
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.replace("/auth/Signin")}
                >
                    <Text className="text-black text-xl text-center font-bold mt-3 dark:text-white">
                        Already have an account? SignIn
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Signup;
