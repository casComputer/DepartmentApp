import { useState, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import {
    verifyStudent,
    cancelStudentVerification,
    saveStudentDetails
} from "@controller/teacher/students.controller.js";

import { useTeacherStore } from "@store/teacher.store.js";

const Header = ({ onSave, saving }) => (
    <View className="flex-row items-center justify-between px-2">
        <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={() => router.back()}>
            <MaterialIcons
                name="arrow-back-ios-new"
                size={RFValue(18)}
                color="rgb(59, 130, 246)"
            />
            <Text
                style={{ fontSize: RFPercentage(2.5) }}
                className="text-blue-500 font-semibold">
                Back
            </Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={saving} onPress={onSave}>
            <Text
                style={{ fontSize: RFPercentage(2.5) }}
                className="text-blue-500 font-semibold">
                {saving ? "Saving..." : "Save"}
            </Text>
        </TouchableOpacity>
    </View>
);

const Avatar = ({ fullname, username }) => (
    <>
        <View className="w-[60vw] h-[60vw] rounded-full bg-green-400 self-center mt-10 justify-center items-center">
            <Text
                style={{ fontSize: RFPercentage(18) }}
                className="font-black text-center text-black">
                {fullname?.slice(0, 1)}
            </Text>
        </View>

        <Text
            style={{ fontSize: RFPercentage(2.3) }}
            className="text-center text-gray-900 mt-2">
            @{username}
        </Text>
    </>
);

const Inputs = ({ fullname, rollno, username, setRoll, is_verified }) => {
    return (
        <View>
            <View className="w-full rounded-full border-black border mt-5">
                <TextInput
                    style={{ fontSize: RFPercentage(2.4) }}
                    className="text-black w-full font-bold px-5 py-5"
                    value={fullname}
                    editable={false}
                />
            </View>

            <View className="w-full mt-5 flex-row items-center gap-2">
                <Text
                    style={{ fontSize: RFPercentage(3) }}
                    className="font-bold ">
                    Roll No
                </Text>

                <TextInput
                    style={{
                        fontSize: RFPercentage(3),
                        borderColor: !rollno ? "red" : "black",
                        borderWidth: !rollno ? 2 : 1
                    }}
                    className="text-black flex-1 font-bold px-5 py-5 rounded-full"
                    value={`${rollno}`}
                    disabled={!is_verified}
                    keyboardType="number-pad"
                    onChangeText={(rollno)=>{
                        let cleaned = (rollno ?? "").toString().replace(/\D+/g, "")
                        if (cleaned.length > 1) cleaned = cleaned.replace(/^0+/, "");
                        setRoll(cleaned)
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

    const showConfirm = useCallback((msg, onConfirm) => {
        Alert.alert("Confirm", msg, [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: onConfirm }
        ]);
    }, []);

    const handleCancelVerification = () => {
        if (loading) return;
        showConfirm("Are you sure to delete the user?", async () => {
            setLoading(true);
            await cancelStudentVerification({ studentId: username });
            setLoading(false);
        });
    };

    const handleVerification = async () => {
        if (loading) return;
        setLoading(true);
        await verifyStudent({ studentId: username });
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        await saveStudentDetails({ studentId: username, rollno: roll });
        setSaving(false);
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
        <ScrollView
            className="flex-1 pt-12 px-3 bg-zinc-100"
            contentContainerStyle={{ paddingBottom: 70, flex: 1 }}>
            <Header onSave={handleSave} saving={saving} />

            <Avatar fullname={fullname} username={username} />

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
                    className="flex-1 bg-red-500 rounded-3xl py-5">
                    <Text
                        style={{
                            fontSize: RFPercentage(2.8)
                        }}
                        className="font-bold text-center leading-tight">
                        Remove
                    </Text>
                </TouchableOpacity>

                {!is_verified && (
                    <TouchableOpacity
                        disabled={loading}
                        onPress={handleVerification}
                        className={`flex-1 w-[50%] rounded-3xl ${
                            loading ? "bg-green-400" : "bg-green-500"
                        }`}>
                        <Text
                            style={{ fontSize: RFPercentage(2.8) }}
                            className="font-bold text-center leading-tight py-5">
                            Verify
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

export default VerifyStudent;
