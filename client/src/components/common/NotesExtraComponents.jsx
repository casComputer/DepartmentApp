import { useRef, useState, useEffect } from "react";
import {
    TouchableOpacity,
    View,
    Text,
    Pressable,
    Dimensions,
    Image,
    ToastAndroid,
    ActivityIndicator
} from "react-native";
import Animated, {
    withTiming,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS
} from "react-native-reanimated";
import { router, usePathname } from "expo-router";
import { Feather, Entypo, MaterialIcons as Material } from "@icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";

import { getColorFromString } from "@utils/colors.js";
import { handleDocumentPick, handleUpload } from "@utils/file.upload.js";
import getPdfPreviewUrl from "@utils/pdfPreview.js";
import { downloadFile, checkFileExists } from "@utils/file.js";
import confirm from "@utils/confirm.js";

import {
    uploadFileDetails,
    deleteNotes
} from "@controller/teacher/notes.controller.js";

import { useAppStore, useMultiSelectionList } from "@store/app.store.js";

const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedFeather = Animated.createAnimatedComponent(Feather);

const setGlobalProgress = useAppStore.getState().setGlobalProgress;

const { height: vh } = Dimensions.get("window");

export const FloatingAddButton = ({ parentId }) => {
    const isOpened = useRef(false);

    const rounded = useSharedValue(18);
    const opacity = useSharedValue(0);
    const angle = useSharedValue("0deg");
    const size = useSharedValue(80);
    const translateY = useSharedValue(50);
    const btnScale = useSharedValue(0);

    const handlePress = () => {
        if (!parentId) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            return router.push({
                pathname: "common/CreateNoteFolder",
                params: {
                    parentId
                }
            });
        }

        if (isOpened?.current) {
            translateY.value = withTiming(100, {
                duration: 400
            });
            opacity.value = withTiming(0, {
                duration: 300
            });
            btnScale.value = withSpring(0);
            rounded.value = withSpring(18);
            angle.value = withTiming("0deg", {
                duration: 500
            });
            size.value = withSpring(80);
            isOpened.current = false;
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            rounded.value = withSpring(50);
            size.value = withSpring(50);
            angle.value = withTiming("45deg", {
                duration: 500
            });
            opacity.value = withTiming(1, {
                duration: 300
            });
            btnScale.value = withSpring(1);
            translateY.value = withTiming(0, {
                duration: 400
            });
            isOpened.current = true;
        }
    };

    const floatingAnim = useAnimatedStyle(() => ({
        borderRadius: rounded.value,
        width: size.value,
        height: size.value
    }));

    const extraViewAnim = useAnimatedStyle(() => ({
        opacity: opacity.value,
        height: 100,
        transform: [{ translateY: translateY.value }]
    }));

    const buttonScaleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: btnScale.value }]
    }));

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [
            {
                rotate: angle.value
            }
        ]
    }));

    const handleCreateFolder = () => {
        router.push({
            pathname: "common/CreateNoteFolder",
            params: {
                parentId
            }
        });
    };

    const handleUploadPress = async () => {
        const asset = await handleDocumentPick([
            "application/pdf",
            "image/*",
            "application/vnd.ms-powerpoint", // .ppt
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" // .pptx
        ]);
        if (!asset || !asset.uri) return;

        setGlobalProgress(1);

        const { secure_url, format, public_id } = await handleUpload(
            asset,
            "note",
            setGlobalProgress
        );

        const data = {
            secure_url,
            format,
            parentId,
            size: asset.size,
            filename: asset.name,
            publicId: public_id
        };

        try {
            const response = await uploadFileDetails(data);
        } finally {
            setGlobalProgress(0);
        }
    };

    return (
        <View
            style={{ bottom: vh * 0.2 }}
            className="absolute right-8 bottom-10 items-center"
        >
            <Animated.View
                style={extraViewAnim}
                className="gap-3 items-center justify-end py-3"
            >
                {parentId && (
                    <AnimatedTouchableOpacity
                        style={buttonScaleStyle}
                        onPress={handleUploadPress}
                        className="justify-center items-center bg-btn rounded-2xl"
                    >
                        <Text className="text-xl font-bold text-text-secondary px-4 py-1">
                            Upload
                        </Text>
                    </AnimatedTouchableOpacity>
                )}

                <AnimatedTouchableOpacity
                    style={buttonScaleStyle}
                    onPress={handleCreateFolder}
                    className="justify-center items-center bg-btn rounded-2xl"
                >
                    <Text className="text-xl font-bold text-text-secondary px-4 py-1">
                        Folder
                    </Text>
                </AnimatedTouchableOpacity>
            </Animated.View>

            <AnimatedTouchableOpacity
                style={floatingAnim}
                className="bg-btn justify-center items-center"
                onPress={handlePress}
            >
                <AnimatedFeather
                    style={animatedIconStyle}
                    name="plus"
                    size={35}
                    className="dark:text-white"
                />
            </AnimatedTouchableOpacity>
        </View>
    );
};

const toggleMultiSelectionList = useMultiSelectionList.getState().toggle;
const clearMultiSelectionList = useMultiSelectionList.getState().clear;

export const FolderItem = ({ item, role }) => {
    const [downloading, setDownloading] = useState(false);

    const color = getColorFromString(item.name);

    const isExistsInMultiSelectList = useMultiSelectionList(state =>
        state.isExists(item._id)
    );
    const isSelecting = useMultiSelectionList(state => state.isSelecting());

    const isFolder = item.type === "folder";
    let url = null;

    if (!isFolder && item.fileUrl) {
        url =
            item.format === "pdf"
                ? getPdfPreviewUrl(item.fileUrl)
                : item.fileUrl;
    }

    const openFile = async () => {
        if (downloading) return;

        ToastAndroid.show("Please wait..", ToastAndroid.SHORT);
        setDownloading(true);
        await downloadFile(item.fileUrl, item.format, item.name);
        setDownloading(false);
    };

    const handlePress = () => {
        if (isSelecting) {
            toggleMultiSelectionList(item._id);
        } else if (isFolder) {
            router.push({
                pathname: `/common/notes/${item.name}`,
                params: {
                    folderId: item._id,
                    course: item.course,
                    year: item.year
                }
            });
        } else openFile();
    };

    const onLongPress = () => {
        if (role !== "teacher" && role !== "admin") return;
        toggleMultiSelectionList(item._id);
    };
    return (
        <Pressable
            onLongPress={onLongPress}
            onPress={handlePress}
            className={`mx-2 my-2 flex-1 h-[170px] rounded-xl ${
                isExistsInMultiSelectList ? "bg-card-selected" : "bg-card"
            }`}
        >
            <View className="h-[40px] px-2 mt-3 flex-row justify-between items-start">
                <View className="flex-row items-center gap-2">
                    {isFolder && (
                        <MaterialIcons name="folder" size={25} color={color} />
                    )}
                    <Text
                        allowFontScaling={false}
                        // adjustsFontSizeToFit
                        className="flex-1 text-[12px] font-bold text-text"
                        numberOfLines={2}
                    >
                        {item.name}
                    </Text>
                </View>
            </View>

            <View className="flex-1 w-full justify-center items-center">
                {isFolder ? (
                    <MaterialIcons name="folder" size={110} color={color} />
                ) : (
                    <>
                        <Image
                            source={{ uri: url }}
                            style={{
                                width: "90%",
                                height: 110,
                                marginTop: -5,
                                borderRadius: 4,
                                opacity: 0.8
                            }}
                        />
                        {downloading && (
                            <ActivityIndicator
                                size={"large"}
                                style={{
                                    position: "absolute"
                                }}
                            />
                        )}
                    </>
                )}
            </View>
        </Pressable>
    );
};

export const SelectingHeader = ({ handleSelectAll, handleOpenInBrowser }) => {
    const count = useMultiSelectionList(state => state.list.length);

    const translateY = useSharedValue(-100);
    const ICON_SIZE = 26;

    useEffect(() => {
        translateY.value = withSpring(0);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: translateY.value
            }
        ]
    }));

    const handlePressDismiss = () => {
        translateY.value = withSpring(-100);
        clearMultiSelectionList();
    };

    const handleDelete = () => {
        confirm("Are you sure? You won’t be able to recover this later", () => {
            deleteNotes();
        });
    };

    return (
        <Animated.View
            style={animatedStyle}
            className="w-full mt-6 flex-row items-center justify-between py-4 px-4"
        >
            <View className="flex-row gap-3 items-center">
                <TouchableOpacity onPress={handlePressDismiss}>
                    <Entypo name="cross" size={ICON_SIZE} />
                </TouchableOpacity>
                <Text className="text-xl font-bold dark:text-white">
                    Selected {count}
                </Text>
            </View>
            <View className="flex-row gap-3 items-center">
                <TouchableOpacity onPress={handleSelectAll}>
                    <Material name="select-all" size={ICON_SIZE} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete}>
                    <Material name="delete" size={ICON_SIZE} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};
