import * as IntentLauncher from "expo-intent-launcher";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";
import { Platform, ToastAndroid } from "react-native";

import getMimeType from "@utils/getMimeType.js";
import {
    getSystemStorageUri,
    saveSystemStorageUri
} from "@storage/app.storage.js";

export const checkFileExists = async (
    filename,
    localDir = FileSystem.documentDirectory
) => {
    let contentUri = null;
    let fileUri = null;

    // SAF check
    try {
        const dirUri = getSystemStorageUri();
        if (dirUri) {
            const files =
                await FileSystem.StorageAccessFramework.readDirectoryAsync(
                    dirUri
                );

            contentUri =
                files.find(uri =>
                    decodeURIComponent(uri).endsWith("/" + filename)
                ) ?? null;
        }
    } catch {}

    // Local file check
    try {
        const localPath = localDir + filename;
        const info = await FileSystem.getInfoAsync(localPath);
        
        if (info.exists) fileUri = info.uri;
    } catch {}
    
    return {
        exists: Boolean(contentUri || fileUri),
        contentUri,
        fileUri
    };
};


export const openFileWithDefaultApp = async (uri, mimeType) => {
    try {
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
            data: uri,
            flags: 1,
            type: mimeType
        });
    } catch {
        ToastAndroid.show("Unable to open file", ToastAndroid.LONG);
    }
};

export const ensureDirectoryPermission = async () => {
    let dirUri = getSystemStorageUri();

    try {
        await FileSystem.StorageAccessFramework.readDirectoryAsync(dirUri);
        return dirUri;
    } catch {
        const perm =
            await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!perm.granted) return null;

        saveSystemStorageUri(perm.directoryUri);
        return perm.directoryUri;
    }
};

export const saveFile = async (
    localUri,
    filename,
    format,
    autoOpen = false
) => {
    // iOS → keep file:// only
    if (Platform.OS !== "android") {
        return {
            success: true,
            fileUri: localUri,
            contentUri: null
        };
    }

    const mimeType = getMimeType(format);
    const dirUri = await ensureDirectoryPermission();
    if (!dirUri) return { success: false };

    await deleteSAFIfExists(dirUri, filename);

    try {
        const base64 = await FileSystem.readAsStringAsync(localUri, {
            encoding: FileSystem.EncodingType.Base64
        });

        const contentUri =
            await FileSystem.StorageAccessFramework.createFileAsync(
                dirUri,
                filename,
                mimeType
            );
            
        await FileSystem.writeAsStringAsync(contentUri, base64, {
            encoding: FileSystem.EncodingType.Base64
        });

        if (autoOpen) {
            await openFileWithDefaultApp(contentUri, mimeType);
        }

        return {
            success: true,
            fileUri: localUri, // ← Expo Sharing
            contentUri // ← Android system
        };
    } catch (err) {
        console.log("SAVE ERROR:", err);
        ToastAndroid.show("Failed to save file", ToastAndroid.LONG);
        return { success: false };
    }
};

export const downloadFile = async (
    url,
    format,
    filename = "",
    autoOpen = true
) => {
    try {
        if (!filename) filename = url.split("/").at(-1);

        const mimeType = getMimeType(format);
        const localPath = FileSystem.documentDirectory + filename;

        // Already exists?
        const existing = await checkFileExists(filename);
        if (existing.exists && existing.contentUri) {
            if (autoOpen && existing.contentUri) {
                await openFileWithDefaultApp(existing.contentUri, mimeType);
            }
            
            return {
                success: true,
                fileUri: existing.fileUri,
                contentUri: existing.contentUri
            };
        }

        // Download to local file://
        const result = await FileSystem.downloadAsync(url, localPath);

        // Save copy to SAF
        const saved = await saveFile(result.uri, filename, format, autoOpen);

        return {
            success: true,
            fileUri: result.uri,
            contentUri: saved.contentUri
        };
    } catch (err) {
        console.error("Download error:", err);
        return { success: false };
    }
};

export const openFileInBrowser = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
        await Linking.openURL(url);
    } else {
        ToastAndroid.show(`Cannot open URL`, ToastAndroid.LONG);
    }
};

export const deleteSAFIfExists = async (dirUri, filename) => {
    try {
        const files =
            await FileSystem.StorageAccessFramework.readDirectoryAsync(dirUri);

        const found = files.find(uri =>
            decodeURIComponent(uri).endsWith("/" + filename)
        );

        if (found) {
            await FileSystem.StorageAccessFramework.deleteAsync(found);
            return true;
        }
    } catch (e) {
        console.log("SAF delete error:", e);
    }
    return false;
};

export const deleteFileEverywhere = async (
    filename,
    localDir = FileSystem.documentDirectory
) => {
    let deleted = false;

    try {
        const dirUri = getSystemStorageUri();
        if (dirUri) {
            const files =
                await FileSystem.StorageAccessFramework.readDirectoryAsync(
                    dirUri
                );

            const found = files.find(uri =>
                decodeURIComponent(uri).endsWith("/" + filename)
            );

            if (found) {
                await FileSystem.StorageAccessFramework.deleteAsync(found);
                deleted = true;
            }
        }
    } catch (e) {
        console.log("SAF delete error:", e);
    }

    try {
        const localPath = localDir + filename;
        const info = await FileSystem.getInfoAsync(localPath);

        if (info.exists) {
            await FileSystem.deleteAsync(localPath, { idempotent: true });
            deleted = true;
        }
    } catch (e) {
        console.log("Local delete error:", e);
    }

    return deleted;
};
