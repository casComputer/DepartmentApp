import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import {
    verifyTeacher,
    cancelVerification,
} from "@controller/admin/teachers.controller";

import { useAdminStore } from "@store/admin.store.js";
import Header from "@components/common/Header2.jsx";

const ClassInChargeInfo = ({ year = "", classCharge = "" }) => {
    if (!year || !classCharge) return null;

    return (
        <View className="mt-5 px-6 py-2 rounded-3xl">
            <Text className="text-xl text-text text-center font-bold">
                In Charge: {year} {classCharge}
            </Text>
        </View>
    );
};

const AssignClass = ({ user }) => {
    return (
        <View>
            <ClassInChargeInfo
                year={user.in_charge_year}
                classCharge={user.in_charge_course}
            />

            <TouchableOpacity
                onPress={() =>
                    router.push({
                        pathname: `/(admin)/(others)/AssignClass`,
                        params: { userId: user.teacherId },
                    })
                }
            >
                <Text className="text-center bg-btn text-text font-bold text-xl mt-10 py-6 rounded-3xl">
                    {user?.in_charge_course && user?.in_charge_year
                        ? "Reassign Class"
                        : "Assign class"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const VerifyTeacher = () => {
    const { teacherId } = useLocalSearchParams();
    const user = useAdminStore((state) =>
        state.teachers.find((t) => t.teacherId === teacherId)
    );

    const handleCancelVerification = () => {
        if (user && user.teacherId) {
            cancelVerification(user.teacherId);
        }
    };

    const handleVerification = async () => {
        if (user && user.teacherId) verifyTeacher(user.teacherId);
    };

    if (!user) {
        return (
            <View className="flex-1 pt-12 px-3 bg-zinc-100">
                <Text className="text-center text-gray-900 text-xl mt-1">
                    Teacher not found
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-primary">
            <Header />

            {/* Image */}
            <TouchableOpacity className="w-[60vw] h-[60vw] rounded-full bg-card self-center mt-10 justify-center items-center">
                <Text className="text-[40vw] font-black text-center text-text-secondary">
                    {user.fullname?.slice(0, 1)}
                </Text>
            </TouchableOpacity>

            <Text className="text-center text-text text-xl mt-1">
                @{user.teacherId}
            </Text>

            <View className="w-full h-[8vh] rounded-full border-text border mt-5">
                <TextInput
                    className="text-text w-full h-full font-bold text-[5vw] px-5"
                    value={user.fullname}
                    editable={false}
                />
            </View>

            {!user.is_verified ? (
                <View className="flex-1 justify-center items-end flex-row gap-3 py-20">
                    <TouchableOpacity
                        onPress={handleCancelVerification}
                        className="flex-1 bg-red-500 rounded-3xl justify-center items-center py-6"
                    >
                        <Text className="text-xl font-bold">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleVerification}
                        className="flex-1 bg-green-500 rounded-3xl justify-center items-center py-6"
                    >
                        <Text className="text-xl font-bold">Verify</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <AssignClass user={user} />
            )}
        </View>
    );
};

export default VerifyTeacher;
