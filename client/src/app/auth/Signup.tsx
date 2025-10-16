import { router } from "expo-router";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
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
    const { user } = useAppStore();
    const [formData, setFormData] = useState<FormData>({
        username: "",
        fullName: "",
        password: "",
        year: "",
        course: ""
    });

    const getData = (extra: any) => {
        setFormData(prev => ({ ...prev, ...extra }));
    };

    return (
        <View style={styles.container} className="bg-red-500">
            <Text style={styles.title}>Signup</Text>

            <View style={styles.inputsContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="username"
                    autoCapitalize="none"
                    placeholderTextColor={
                        "rgba(255, 255, 255, 0.7)"
                    }
                    onChangeText={text =>
                        setFormData({ ...formData, username: text })
                    }
                    value={formData.username}
                />

                <TextInput
                    style={styles.input}
                    placeholder="full name"
                    placeholderTextColor={
                        "rgba(255, 255, 255, 0.7)"
                    }
                    onChangeText={text =>
                        setFormData({ ...formData, fullName: text })
                    }
                    value={formData.fullName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={
                        "rgba(255, 255, 255, 0.7)"
                    }
                    autoCapitalize="none"
                    onChangeText={text =>
                        setFormData({ ...formData, password: text })
                    }
                    value={formData.password}
                    secureTextEntry
                />

                {user?.role === "student" && <StudentExtra getData={getData} />}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.btn} onPress={() => handleSignup(formData as FormData)}>
                    <Text style={styles.btnText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/auth/Signin")}>
                    <Text style={styles.redirectText}>
                        Already have an account? SignIn
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
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

