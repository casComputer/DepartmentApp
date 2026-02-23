import { useEffect, useState } from "react";
import {
    View,
    Text,
    Pressable,
    Image,
    TextInput,
    TouchableOpacity
} from "react-native";
import { router } from "expo-router";
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { formatDate, isDatePassed } from "@utils/date.js";
import getPdfPreviewUrl from "@utils/pdfPreview.js";
import {
    downloadFile,
    checkFileExists,
    openFileInBrowser
} from "@utils/file.js";

import CircularProgress from "@components/common/CircularProgress.jsx";

import {
    rejectAssignment,
    acceptAssignment
} from "@controller/teacher/assignment.controller.js";

export const AssignmentRenderItem = ({ item }) => (
    <Pressable
        onPress={() =>
            router.push({
                params: {
                    assignmentId: item._id
                },
                pathname: "/common/assignment/AssignmentShow"
            })
        }
        className="p-5 rounded-3xl bg-card mt-2"
        style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
    >
        <Text className="text-xl font-black text-text">{item.topic}</Text>
        <Text
            numberOfLines={2}
            className="text-text/700 font-bold text-lg pl-3"
        >
            {item.description}
        </Text>

        <View className="flex-row justify-between items-center">
            <View>
                <Text className="text-xl font-black mt-3 text-text">
                    {item.year} {item.course}
                </Text>
                <Text
                    className={` font-bold text-sm ${isDatePassed(item.dueDate) ? "text-red-500" : "text-text"} `}
                >
                    Due Date:
                    {new Date(item.dueDate).toLocaleDateString()}
                </Text>
            </View>
            <View>
                <CircularProgress
                    size={60}
                    strokeWidth={5}
                    progress={
                        item.strength < 1
                            ? 0
                            : (item.submissions?.length / item.strength) * 100
                    }
                    fraction={`${item.submissions?.length || 0} / ${item.strength || 0}`}
                />
            </View>
        </View>
    </Pressable>
);

const RejectAcceptBtn = ({ handleReject, handleAccept }) => {
    const [rejecting, setRejecting] = useState(false);
    const [accepting, setAccepting] = useState(false);

    const handlePressRejection = async () => {
        if (rejecting) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        setRejecting(true);
        await handleReject();
        setRejecting(false);
    };

    const handlePressAccept = async () => {
        if (accepting) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        setAccepting(true);
        await handleAccept();
        setAccepting(false);
    };

    return (
        <View className="flex-row justify-around py-2">
            <TouchableOpacity
                disabled={rejecting}
                onPress={handlePressRejection}
                className="self-center"
            >
                <Text className="px-3 rounded-full text-red-500 text-xl font-bold text-center">
                    {rejecting ? "Rejecting.." : "Reject"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                disabled={accepting}
                onPress={handlePressAccept}
                className="self-center"
            >
                <Text className="px-3 rounded-full text-green-500 text-xl font-bold text-center">
                    {accepting ? "Accepting.." : "Accept"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export const AssignmentShowRenderItem = ({
    item,
    assignmentId,
    setAssignment
}) => {
    let url = item.url;

    const [isDownloaded, setIsDownloaded] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [rejectionMessage, setRejectionMessage] = useState("");

    const height = useSharedValue(0);

    if (item.format === "pdf") {
        url = getPdfPreviewUrl(url);
    }

    useEffect(() => {
        const checkIfDownloaded = async () => {
            const filename = url.split("/").at(-1);
            const result = await checkFileExists(filename);
            setIsDownloaded(result);
        };
        checkIfDownloaded();
    }, [url]);

    useEffect(() => {
        if (item.status === "rejected") height.value = withTiming(150, 800);
    }, [item.status]);

    const handleReject = async () => {
        if (rejectionMessage.trim()?.length === 0) {
            height.value = withTiming(150, 500);
        } else
            await rejectAssignment(
                assignmentId,
                item.studentId,
                rejectionMessage?.trim() ?? "",
                setAssignment
            );
    };

    const handleAccept = async () => {
        await acceptAssignment(assignmentId, item.studentId, setAssignment);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        maxHeight: height.value,
        opacity: height.value === 0 ? 0 : 1,
        transform: [
            {
                scaleY: height.value === 0 ? 0.95 : 1
            }
        ]
    }));

    const handleDownload = async () => {
        setIsDownloading(true);
        await downloadFile(item.url, item.format);
        setIsDownloading(false);
        setIsDownloaded(true);
    };

    return (
        <View className="justify-center rounded-xl bg-card px-4 py-2 gap-1">
            <Text className="font-bold text-2xl text-text ">
                {item.studentId}
            </Text>
            <Text className="font-semibold text-md text-text ">
                Submitted on {formatDate(item.createdAt)}{" "}
                {item.createdAt?.split("T")?.[1]?.split(".")?.[0]}
            </Text>

            <View className="w-[90%] self-center mt-2 rounded-lg bg-zinc-950 h-[250px] overflow-hidden mb-2">
                <Image
                    source={{ uri: url }}
                    style={{ width: "100%", height: "100%" }}
                />
                <Text className="bg-card-selected w-full py-1 absolute bottom-0 left-0 text-center text-text text-lg">
                    {url.split("/")?.at(-1)}
                </Text>
            </View>
            <TouchableOpacity onPress={handleDownload} className="self-center">
                <Text className="px-3 rounded-full text-blue-500 text-xl font-bold text-center pt-2">
                    {!isDownloaded?.exists
                        ? isDownloading
                            ? "Downloading.."
                            : "Download"
                        : "Open File"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => openFileInBrowser(item.url)}
                className="self-center mt-2"
            >
                <Text className="px-3 rounded-full text-blue-500 text-xl font-bold text-center">
                    Open File In Browser
                </Text>
            </TouchableOpacity>

            <Animated.View style={animatedStyle} className="mt-1">
                <TextInput
                    className="bg-card-selected rounded-xl text-text overflow-hidden px-3 py-2"
                    multiline
                    value={
                        item.status === "rejected"
                            ? item.rejectionMessage || "No reason specified!"
                            : rejectionMessage
                    }
                    onChangeText={setRejectionMessage}
                    placeholder={"Specify rejection reason..."}
                    editable={item.status === "pending"}
                />
            </Animated.View>

            {item.status === "pending" ? (
                <RejectAcceptBtn
                    handleReject={handleReject}
                    handleAccept={handleAccept}
                />
            ) : (
                <Text
                    className={`font-bold py-2 text-xl text-center capitalize ${
                        item.status === "rejected"
                            ? "text-red-500"
                            : "text-green-500"
                    }`}
                >
                    {item.status}
                </Text>
            )}
        </View>
    );
};
