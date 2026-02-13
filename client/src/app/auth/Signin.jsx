import { useState, useRef, useEffect } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
    BackHandler,
} from "react-native";
import { AntDesign, Feather } from "@icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useRouter  } from "expo-router";

import handleSignin from "../../controller/auth/auth.controller.js";
import { Chip } from "../../components/auth/StudentExtra.jsx";

const { width: vw } = Dimensions.get("window");

const Signin = () => {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [message, setMessage] = useState("");
    const [isPassVisible, setIsPassVisible] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const handler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                if(!router.canGoBack()) router.replace("/");
                else router.back();
                return true;
            },
        );
        return () => handler.remove();
    }, []);

    const usernameRef = useRef();

    const passwordRef = useRef();

    const handleSubmit = async () => {
        if (username.trim()?.length < 5) {
            setMessage({
                type: "error",
                message: "username is too short",
            });
            usernameRef.current?.setNativeProps({
                style: {
                    borderColor: "red",
                },
            });
            return;
        }

        if (password.trim()?.length <= 5) {
            setMessage({
                type: "error",
                message: "password is too short",
            });

            passwordRef.current?.setNativeProps({
                style: {
                    borderColor: "red",
                },
            });
            return;
        }

        if (!role) {
            setMessage({
                type: "error",
                message: "please select a role",
            });

            return;
        }

        setMessage({
            type: "info",
            message: "please wait...",
        });

        const { success, message: resMessage } = await handleSignin({
            username,
            password,
            userRole: role,
            endpoint: "signin",
        });

        setMessage({
            type: success ? "success" : "error",
            message: resMessage,
        });
    };

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ paddingBottom: 100 }}
            className="flex-1 pt-20 bg-primary"
        >
            <Text
                style={{ fontSize: vw * 0.2 }}
                className="font-black text-text px-3"
            >
                SignIn
            </Text>

            <View className="mt-8 gap-3 px-4 h-full">
                <Text
                    className={`font-bold text-lg text-center my-5 ${
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
                    className={`border py-6 px-5 text-xl font-bold rounded-full text-text 
                         ${
                             message.type === "error" && username.length <= 5
                                 ? "border-red-500"
                                 : "border-black dark:border-white"
                         }`}
                    ref={usernameRef}
                    placeholder="username"
                    placeholderTextColor={"rgba(119,119,119,0.7)"}
                    keyboardType="username"
                    autoCapitalize="none"
                    onChangeText={(txt) =>
                        setUsername(txt.replace(/[^a-zA-Z0-9._-]/g, ""))
                    }
                    value={username}
                />

                <View className="relative">
                    <TextInput
                        ref={passwordRef}
                        className="border border-black py-6 px-5 text-xl font-bold text-text dark:border-white rounded-full"
                        placeholder="Password"
                        placeholderTextColor={"rgba(119,119,119,0.7)"}
                        autoCapitalize="none"
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={!isPassVisible}
                    />
                    <TouchableOpacity
                        onPress={() => setIsPassVisible((prev) => !prev)}
                        className="absolute top-1/2 -translate-y-1/2 right-5"
                    >
                        {isPassVisible ? (
                            <Feather name="eye" size={20} />
                        ) : (
                            <AntDesign name="eye-invisible" size={20} />
                        )}
                    </TouchableOpacity>
                </View>

                <Text className="text-text font-bold text-2xl mt-5 px-3">
                    Select role:
                </Text>
                <View className="flex-row justify-center items-center py-5 px-3 gap-5">
                    {["Teacher", "Student", "Parent", "Admin"].map((y) => (
                        <Chip
                            key={y}
                            year={y}
                            setSelected={setRole}
                            isSelected={role === y}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    className="bg-green-400 py-5 w-full rounded-3xl mt-10"
                    onPress={handleSubmit}
                >
                    <Text className="text-text font-black text-3xl text-center">
                        Sign In
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default Signin;
