import * as IntentLauncher from "expo-intent-launcher";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";
import { Platform, ToastAndroid } from "react-native";

import getMimeType from "@utils/getMimeType.js";
import {
    getSystemStorageUri,
    saveSystemStorageUri,
} from "@storage/app.storage.js";

/*
    calling downloadFile will automatically download,
    save, overwrite if the already exist and
    open in default app for viewing 
*/

// REMOVED FILEURI RETURNS, IS APP NOT BREAKS AFTER TESTING, CAN REMOVE COMMENTED LINES

export const checkFileExists = async (
    filename,
    localDir = FileSystem.documentDirectory,
) => {
    let contentUri = null;
    // let fileUri = null;

    try {
        const dirUri = getSystemStorageUri();

        if (dirUri) {
            const files =
                await FileSystem.StorageAccessFramework.readDirectoryAsync(
                    dirUri,
                );

            contentUri =
                files.find((uri) => {
                    const decoded = decodeURIComponent(uri);
                    return decoded.endsWith("/" + filename);
                }) ?? null;
        }
    } catch (e) {}

    // try {
    //     const localPath = localDir + filename;
    //     const info = await FileSystem.getInfoAsync(localPath);

    //     if (info.exists) {
    //         fileUri = info.uri;
    //     }
    // } catch (e) {}

    return {
        // exists: Boolean(contentUri || fileUri),
        exists: Boolean(contentUri),
        contentUri,
        // fileUri
    };
};

export const openFileWithDefaultApp = async (uri, mimeType) => {
    try {
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
            data: uri,
            flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
            type: mimeType,
        });
    } catch (err) {
        ToastAndroid.show("Error opening file:", ToastAndroid.LONG);
    }
};

export const saveFile = async (
    localUri,
    filename,
    format,
    autoOpen = false,
) => {
    // iOS: still keep file:// only
    if (Platform.OS !== "android") {
        await Sharing.shareAsync(localUri);
        return {
            success: true,
            // fileUri: localUri,
            contentUri: null,
        };
    }

    const mimetype = getMimeType(format);
    const dirUri = await ensureDirectoryPermission();
    if (!dirUri) return { success: false };

    await deleteIfExists(dirUri, filename);

    try {
        const base64 = await FileSystem.readAsStringAsync(localUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const contentUri =
            await FileSystem.StorageAccessFramework.createFileAsync(
                dirUri,
                filename,
                mimetype,
            );

        await FileSystem.writeAsStringAsync(contentUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
        });

        await FileSystem.deleteAsync(localPath, {
            idempotent: true,
        });

        if (autoOpen) {
            await openFileWithDefaultApp(contentUri, mimetype);
        }

        return {
            success: true,
            // fileUri: localUri, // file://
            contentUri, // content://
        };
    } catch (err) {
        ToastAndroid.show("Failed to save file!", ToastAndroid.LONG);
        console.log("SAVE ERROR:", err);
        return { success: false };
    }
};

export const downloadFile = async (
    url,
    format,
    filename = "",
    autoOpen = true,
) => {
    if (!filename) filename = url.split("/").at(-1);

    const { exists, contentUri } = await checkFileExists(filename);
    const mimeType = getMimeType(format);

    if (exists && contentUri) {
        if (autoOpen && contentUri)
            await openFileWithDefaultApp(contentUri, mimeType);

        return {
            success: true,
            contentUri,
        };
    }

    const result = await FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + filename,
    );

    return saveFile(result.uri, filename, format, autoOpen);
};

export const deleteIfExists = async (
    dirUri,
    filename,
    localDir = FileSystem.documentDirectory,
) => {
    let deleted = false;
    try {
        if (!dirUri) dirUri = await ensureDirectoryPermission();

        const files =
            await FileSystem.StorageAccessFramework.readDirectoryAsync(dirUri);

        const foundUri = files.find((uri) => {
            const decoded = decodeURIComponent(uri);
            return decoded.endsWith("/" + filename);
        });

        if (foundUri) {
            await FileSystem.StorageAccessFramework.deleteAsync(foundUri);
            deleted = true;
        }
    } catch (e) {
        console.log("Delete check error:", e);
    }

    try {
        const localPath = localDir + filename;
        const info = await FileSystem.getInfoAsync(localPath);

        if (info.exists) {
            await FileSystem.deleteAsync(localPath, {
                idempotent: true,
            });
            deleted = true;
        }
    } catch (e) {
        console.log("Local delete error:", e);
    }

    return deleted;
};

export const ensureDirectoryPermission = async () => {
    let dirUri = getSystemStorageUri();

    try {
        await FileSystem.StorageAccessFramework.readDirectoryAsync(dirUri);
        return dirUri;
    } catch (e) {
        const perm =
            await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (!perm.granted) return null;

        saveSystemStorageUri(perm.directoryUri);
        return perm.directoryUri;
    }
};

export const openFileInBrowser = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
        await Linking.openURL(url);
    } else {
        ToastAndroid.show(
            `Don't know how to open this URL: ${url}`,
            ToastAndroid.LONG,
        );
    }
};
