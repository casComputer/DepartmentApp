import { ToastAndroid } from "react-native";
import * as Sharing from "expo-sharing";

import { checkFileExists, openFileWithDefaultApp } from "@utils/file.js";
import getMimeType from "@utils/getMimeType.js";

export const openFile = async (type, filename) => {
    if (type === "pdf") {
        const { contentUri, exists } = await checkFileExists(
            filename + ".pdf"
        );
        const mimeType = getMimeType("pdf");

        if (exists && contentUri) {
            await openFileWithDefaultApp(contentUri, mimeType);
        } else
            ToastAndroid.show("Unable to open the file.", ToastAndroid.SHORT);
    } else if (type === "xl") {
        const { contentUri, exists } = await checkFileExists(
            filename + ".xlsx"
        );
        const mimeType = getMimeType("xlsx");

        if (exists && contentUri) {
            await openFileWithDefaultApp(contentUri, mimeType);
        } else
            ToastAndroid.show("Unable to open the file.", ToastAndroid.SHORT);
    }
};

export const shareFile = async (type, filename) => {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
        ToastAndroid.show(
            "Sharing is not available on this device",
            ToastAndroid.SHORT
        );
        return;
    }
    
    console.log(type, filename);

    if (type === "pdf") {
        const mimeType = getMimeType("pdf");
        const { fileUri } = await checkFileExists(filename + ".pdf");

        if (fileUri) {
            await Sharing.shareAsync(fileUri, {
                mimeType: mimeType,
                dialogTitle: "Share"
            });
        } else
            ToastAndroid.show("Unable to share the file", ToastAndroid.SHORT);
    } else if (type === "xl") {
        const mimeType = getMimeType("xlsx");
        const { fileUri } = await checkFileExists(filename + ".xlsx");

        if (fileUri) {
            await Sharing.shareAsync(fileUri, {
                mimeType: mimeType,
                dialogTitle: "Share"
            });
        } else
            ToastAndroid.show("Unable to share the file", ToastAndroid.SHORT);
    }
};
