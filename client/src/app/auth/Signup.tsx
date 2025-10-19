import { router } from "expo-router";
import { useState, useCallback } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView
} from "react-native";

import StudentExtra from "../../components/auth/StudentExtra.jsx";
import { useAppStore } from "../../store/app.store";
import handleSignup from "../../controller/auth/signup.controller.js";

type FormData = {
    username: string;
    fullName: string;
    password: string;
    year?: string;
    course?: string;
};

const Signup = () => {
    const userRole = useAppStore.getState().user?.role;

    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [year, setYear] = useState("");
    const [course, setCourse] = useState("");

    const handleSubmit = async formData => {
        try {
            await handleSignup(formData);
            router.replace("/auth/Signin");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            className="bg-red-500"
        >
            <Text style={styles.title}>Signup</Text>

            <View style={styles.inputsContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="username"
                    autoCapitalize="none"
                    placeholderTextColor={"rgba(255, 255, 255, 0.7)"}
                    onChangeText={txt => setUsername(txt)}
                    value={username}
                />

                <TextInput
                    style={styles.input}
                    placeholder="full name"
                    placeholderTextColor={"rgba(255, 255, 255, 0.7)"}
                    onChangeText={txt => setFullName(txt)}
                    value={fullName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={"rgba(255, 255, 255, 0.7)"}
                    autoCapitalize="none"
                    onChangeText={txt => setPassword(txt)}
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

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={async () =>
                        await handleSignup({
                            username,
                            password,
                            fullName,
                            course,
                            year
                        })
                    }
                >
                    <Text style={styles.btnText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.replace("/auth/Signin")}
                >
                    <Text style={styles.redirectText}>
                        Already have an account? SignIn
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000ff",
        paddingTop: 70,
        paddingHorizontal: 16
    },
    title: {
        fontSize: 65,
        fontWeight: "bold",
        marginBottom: 20,
        color: "white"
    },
    inputsContainer: {
        marginTop: 80,
        flex: 1
    },
    input: {
        height: 70,
        borderRadius: 26,
        paddingHorizontal: 18,
        marginBottom: 20,
        borderWidth: 1,
        fontSize: 18,
        borderColor: "white",
        color: "white"
    },
    footer: {
        paddingBottom: 100
    },

    btn: {
        backgroundColor: "#45db3aff",
        paddingVertical: 18,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 24
    },
    btnText: {
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 22
    },
    redirectText: {
        color: "white",
        fontSize: 20,
        textAlign: "center",
        marginTop: 10
    }
});

export default Signup;
