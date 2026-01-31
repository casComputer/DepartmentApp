import { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions
} from "react-native";
import {
    MaterialIcons,
    FontAwesome,
    Ionicons,
    Entypo
} from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import {
    verifyParent,
    removeParent
} from "@controller/teacher/parent.controller.js";

import { openPhone, openWhatsApp, openEmail } from "@utils/openApp.js";
import confirm from "@utils/confirm";

import { useAppStore } from "@store/app.store.js";

const iconSize = 18;
const { width: vw } = Dimensions.get("window");

const Students = ({ students, userId }) => {
    const [verifying, setVerifying] = useState(null);
    const [rejecting, setRejecting] = useState(null);

    const handleVerification = studentId => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        confirm(
            `Are you sure to verify ${userId} as parent of ${studentId}`,
            async () => {
                setVerifying(studentId);
                await verifyParent(studentId, userId);
                setVerifying(null);
            }
        );
    };

    const handleRejection = studentId => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        confirm(
            `Are you sure to reject ${userId} as parent of ${studentId}`,
            async () => {
                setRejecting(studentId);
                await removeParent(studentId, userId);
                setRejecting(null);
            }
        );
    };

    return (
        <View>
            {!!students?.length && (
                <View className="w-full my-2">
                    <Text className="text-text font-black text-2xl pt-2">
                        STUDENTS
                    </Text>
                    {students?.map(student => (
                        <View
                            key={student.studentId}
                            className="flex-row items-center py-1 gap-5 pl-5"
                        >
                            <Text className="w-[70%] font-bold text-lg text-text">
                                {student.studentId}
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    handleRejection(student.studentId)
                                }
                            >
                                {rejecting === student.studentId ? (
                                    <ActivityIndicator color="rgb(239, 68, 68)" />
                                ) : (
                                    <Entypo
                                        name="cross"
                                        size={iconSize}
                                        color="rgb(239, 68, 68)"
                                    />
                                )}
                            </TouchableOpacity>
                            {!student.isVerified && (
                                <TouchableOpacity
                                    onPress={() =>
                                        handleVerification(student.studentId)
                                    }
                                >
                                    {verifying === student.studentId ? (
                                        <ActivityIndicator color="rgb(34, 197, 94)" />
                                    ) : (
                                        <Ionicons
                                            name="checkmark"
                                            size={iconSize}
                                            color="rgb(34, 197, 94)"
                                        />
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const Details = ({ phone, email, message }) => (
    <View className="w-full mt-1">
        {email ? (
            <TouchableOpacity onPress={() => openEmail(email)}>
                <Text className="text-blue-500 font-bold text-sm text-center">
                    {email}
                </Text>
            </TouchableOpacity>
        ) : null}
        {phone ? (
            <View className="mt-1 flex-row items-center justify-center gap-3">
                <TouchableOpacity onPress={() => openPhone(phone)}>
                    <Text className="text-blue-500 font-bold text-xl text-center">
                        {phone}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openPhone(phone)}>
                    <MaterialIcons
                        name="call"
                        size={iconSize}
                        color="rgb(59, 130, 246)"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openWhatsApp(phone, message)}>
                    <FontAwesome
                        name="whatsapp"
                        size={iconSize}
                        color="rgb(34, 197, 94)"
                    />
                </TouchableOpacity>
            </View>
        ) : null}
    </View>
);

const Avatar = ({ dp, fullname, userId }) => (
    <View className="items-center">
        <View className="bg-card-selected w-[150px] h-[150px] rounded-full overflow-hidden justify-center items-center">
            {dp ? (
                <Image
                    source={{ uri: dp }}
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                />
            ) : (
                <Text
                    allowFontScale={false}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{ fontSize: vw * 0.15 }}
                    className="w-full text-center px-4 text-text-secondary font-black"
                >
                    {fullname[0]}
                </Text>
            )}
        </View>

        <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            className="w-full -mt-4 text-center text-text-secondary font-semibold text-xl"
        >
            @{userId}
        </Text>
        <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            className="w-full text-center text-text font-bold text-4xl"
        >
            {fullname}
        </Text>
    </View>
);

export const TeacherItem = ({ item }) => {
    const fullname = useAppStore(state => state.user.fullname);

    const studentMsg =
        item.students?.length === 1
            ? item.students[0].studentId
            : item?.students
                  ?.map(st => st.studentId)
                  ?.slice(0, -1)
                  ?.join(", ") +
              " and " +
              item?.students?.at(-1)?.studentId;

    const message = `*Hi ${item.fullname.toUpperCase()}*,
    
This is *${fullname.toUpperCase()}*,
the class teacher of *${studentMsg}*.
    
I am reaching out to inform you / enquire about ...
    `;

    return (
        <View
            className={`bg-card my-2 rounded-3xl p-4 justify-center items-center`}
            style={{ width: vw * 0.9, marginHorizontal: vw * 0.05 }}
        >
            <Avatar
                dp={item?.dp}
                fullname={item.fullname}
                userId={item.userId}
            />

            <Students userId={item.userId} students={item.students ?? []} />

            <Details message={message} email={item.email} phone={item.phone} />
        </View>
    );
};
