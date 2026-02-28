import { useState, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    Image
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import {
    verifyStudent,
    cancelStudentVerification,
    saveStudentDetails
} from "@controller/teacher/students.controller.js";

import Header from "@components/common/Header2.jsx";
import confirm from "@utils/confirm.js";

import { useTeacherStore } from "@store/teacher.store.js";

const Avatar = ({ fullname, username, dp }) => (
    <>
        <View className="w-[60vw] h-[60vw] rounded-full bg-btn self-center mt-10 justify-center items-center">
            {dp ? (
                <Image
                    source={{ uri: dp }}
                    resizeMode="cover"
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 10000
                    }}
                />
            ) : (
                <Text className="font-black text-[8rem] text-center text-text">
                    {fullname?.slice(0, 1)}
                </Text>
            )}
        </View>

        <Text className="text-center text-2xl text-text-secondary mt-2 ">
            @{username}
        </Text>
    </>
);

const Inputs = ({ fullname, rollno, username, setRoll, is_verified }) => {
    return (
        <View>
            <View className="w-full rounded-full border-border border mt-5">
                <TextInput
                    className="w-full font-bold px-5 py-5 text-text text-2xl"
                    value={fullname}
                    editable={false}
                />
            </View>

            <View className="w-full mt-5 flex-row items-center gap-2">
                <Text className="font-bold text-text text-2xl">Roll No</Text>

                <TextInput
                    style={{
                        borderWidth: !rollno ? 2 : 1
                    }}
                    className={`flex-1 text-2xl border font-bold px-5 py-5 rounded-full text-text ${
                        !rollno ? "border-red-500" : "border-border"
                    }`}
                    value={`${rollno}`}
                    editable={Boolean(is_verified)}
                    keyboardType="number-pad"
                    onChangeText={rollno => {
                        let cleaned = (rollno ?? "")
                            .toString()
                            .replace(/\D+/g, "");
                        if (cleaned.length > 1)
                            cleaned = cleaned.replace(/^0+/, "");
                        setRoll(cleaned);
                    }}
                />
            </View>
        </View>
    );
};

// ---------------------- Main ----------------------
const VerifyStudent = () => {
    const { username, fullname } = useLocalSearchParams();

    const student = useTeacherStore(s => s.getStudent(username));
    const is_verified = student?.is_verified;
    const rollno = student?.rollno ?? "";

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [roll, setRoll] = useState(rollno);

    const handleCancelVerification = () => {
        if (loading) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        confirm(`Are you sure to delete the user?`, async () => {
            setLoading(true);
            await cancelStudentVerification({
                studentId: username
            });
            setLoading(false);
            router.back();
        });
    };

    const handleVerification = async () => {
        if (loading) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        confirm(`Are you sure to verify the user?`, async () => {
            setLoading(true);
            await verifyStudent({
                studentId: username
            });
            setLoading(false);
        });
    };

    const handleSave = async () => {
        setSaving(true);
        await saveStudentDetails({
            studentId: username,
            rollno: roll
        });
        setSaving(false);
    };

    if (!username) {
        return (
            <View className="flex-1 pt-12 px-3 bg-primary">
                <Text className="text-center text-text text-xl mt-1">
                    Student not found
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-primary">
            <Header onSave={handleSave} saving={saving} />
            <ScrollView
                className="px-2"
                contentContainerStyle={{ paddingBottom: 70, flexGrow: 1 }}
            >
                <Avatar
                    fullname={fullname}
                    username={username}
                    dp={student?.dp}
                />

                <Inputs
                    fullname={fullname}
                    rollno={roll}
                    setRoll={setRoll}
                    username={username}
                    is_verified={is_verified}
                />

                <View className="flex-row gap-3 mt-10 px-3 ">
                    <TouchableOpacity
                        disabled={loading}
                        onPress={handleCancelVerification}
                        className="flex-1 bg-red-500 rounded-3xl py-5"
                    >
                        <Text className="font-bold text-center leading-tight text-text text-2xl">
                            Remove
                        </Text>
                    </TouchableOpacity>

                    {!is_verified && (
                        <TouchableOpacity
                            disabled={loading}
                            onPress={handleVerification}
                            className={`flex-1 w-[50%] rounded-3xl ${
                                loading ? "bg-green-400" : "bg-green-500"
                            }`}
                        >
                            <Text className="font-bold text-2xl text-center leading-tight py-5 text-text">
                                Verify
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default VerifyStudent;
