import { useState, useRef } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
    Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, AntDesign } from "@icons";
import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { useThemeStore } from "../../store/app.store";
import handleSignup from "../../controller/auth/auth.controller.js";

import StudentExtra from "../../components/auth/StudentExtra.jsx";
import ParentExtra from "../../components/auth/ParentExtra.jsx";

const gradientColors = useThemeStore.getState().gradientColors;

const Message = ({ message }) => (
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
);

const { width: vw } = Dimensions.get("window");

const Signup = () => {
    const { userRole } = useLocalSearchParams();

    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [year, setYear] = useState("");
    const [course, setCourse] = useState("");
    const [message, setMessage] = useState({
        type: "",
        message: ""
    });
    const [isPassVisible, setIsPassVisible] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);

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

        if (userRole === "parent") {
            if (selectedStudents?.length <= 0) {
                return setMessage({
                    type: "error",
                    message: "please select your student to continue"
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
            year,
            students: selectedStudents,
            endpoint: "signup"
        });

        setMessage({
            type: success ? "success" : "error",
            message: resMessage
        });
    };

    return (
        <LinearGradient colors={gradientColors} style={{ flexGrow: 1 }}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                className="dark:bg-black"
            >
                <Text
                    style={{ fontSize: vw * 0.2 }}
                    className="font-black dark:text-white px-3 mt-20"
                >
                    SignUp
                </Text>

                {/* Form */}

                <View className="flex-1 gap-5 px-4 mt-5">
                    <Message message={message} />

                    <TextInput
                        ref={usernameRef}
                        className={`text-bold border font-semibold rounded-full overflow-hidden px-5 py-6 text-xl dark:text-white ${
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
                        className={`text-black border font-semibold rounded-full overflow-hidden px-5 py-6 text-xl dark:text-white ${
                            fullName?.trim()?.length > 5
                                ? "border-green-500"
                                : "border-black dark:border-white "
                        }`}
                        placeholderTextColor="rgb(119,119,119)"
                        onChangeText={setFullName}
                        value={fullName}
                    />

                    <View className="relative">
                        <TextInput
                            ref={passwordRef}
                            className={`text-black font-semibold border rounded-full overflow-hidden px-5 py-6 text-xl dark:text-white ${
                                password.length > 5
                                    ? "border-green-500"
                                    : "border-black dark:border-white"
                            }`}
                            placeholder="Password"
                            placeholderTextColor="rgb(119,119,119)"
                            autoCapitalize="none"
                            onChangeText={setPassword}
                            value={password}
                            secureTextEntry={!isPassVisible}
                        />
                        <TouchableOpacity
                            onPress={() => setIsPassVisible(prev => !prev)}
                            className="absolute top-1/2 -translate-y-1/2 right-5"
                        >
                            {isPassVisible ? (
                                <Feather name="eye" size={20} />
                            ) : (
                                <AntDesign name="eye-invisible" size={20} />
                            )}
                        </TouchableOpacity>
                    </View>

                    {(userRole === "student" || userRole === "parent") && (
                        <StudentExtra
                            year={year}
                            setYear={setYear}
                            course={course}
                            setCourse={setCourse}
                        />
                    )}

                    {userRole === "parent" && (
                        <ParentExtra
                            year={year}
                            course={course}
                            selectedStudents={selectedStudents}
                            setSelectedStudents={setSelectedStudents}
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
            </KeyboardAwareScrollView>
        </LinearGradient>
    );
};

export default Signup;
