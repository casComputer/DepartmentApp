import {
    toast
} from "@store/app.store";
import * as Sharing from "expo-sharing";

import {
    checkFileExists,
    openFileWithDefaultApp
} from "@utils/file.js";
import getMimeType from "@utils/getMimeType.js";

export const openFile = async (type, filename) => {
    if (type === "pdf") {
        const {
            contentUri,
            exists
        } = await checkFileExists(
            filename + ".pdf"
        );
        const mimeType = getMimeType("pdf");

        if (exists && contentUri) {
            await openFileWithDefaultApp(contentUri, mimeType);
        } else
            toast.error("Unable to open the file.");
    } else if (type === "xl") {
        const {
            contentUri,
            exists
        } = await checkFileExists(
            filename + ".xlsx"
        );
        const mimeType = getMimeType("xlsx");

        if (exists && contentUri) {
            await openFileWithDefaultApp(contentUri, mimeType);
        } else
            toast.error("Unable to open the file.");
    }
};

export const shareFile = async (type, filename) => {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
        toast.error(
            "Sharing is not available on this device"
        );
        return;
    }

    if (type === "pdf") {
        const mimeType = getMimeType("pdf");
        const {
            fileUri
        } = await checkFileExists(filename + ".pdf");

        if (fileUri) {
            await Sharing.shareAsync(fileUri, {
                mimeType: mimeType,
                dialogTitle: "Share"
            });
        } else
            toast.error("Unable to share the file");
    } else if (type === "xl") {
        const mimeType = getMimeType("xlsx");
        const {
            fileUri
        } = await checkFileExists(filename + ".xlsx");

        if (fileUri) {
            await Sharing.shareAsync(fileUri, {
                mimeType: mimeType,
                dialogTitle: "Share"
            });
        } else
            toast.error("Unable to share the file");
    }
};