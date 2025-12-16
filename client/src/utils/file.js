import * as IntentLauncher from "expo-intent-launcher";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";
import { Platform, ToastAndroid } from "react-native";

import getMimeType from "@utils/getMimeType.js";
import { getSystemStorageUri } from "@storage/app.storage.js";

/*
    calling downloadFile will automatically download,
    save, overwrite if the already exist and
    open in default app for viewing 
*/

export const checkFileExists = async filename => {
    try {
        let dirUri = getSystemStorageUri();
        const files =
            await FileSystem.StorageAccessFramework.readDirectoryAsync(dirUri);

        const foundUri = files.find(uri => {
            const decoded = decodeURIComponent(uri);
            return decoded.endsWith("/" + filename);
        });

        if (foundUri) return { exists: true, foundUri };
        else return { exists: false };
    } catch (error) {
        console.error(error);
        return { exists: false };
    }
};

export const openFileWithDefaultApp = async (uri, mimeType) => {
    try {
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
            data: uri,
            flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
            type: mimeType
        });
    } catch (err) {
        console.log("Error opening file:", err);
    }
};

export const saveFile = async (localUri, filename, format) => {
    if (Platform.OS !== "android") {
        return Sharing.shareAsync(localUri);
    }

    const mimetype = getMimeType(format);

    const dirUri = await ensureDirectoryPermission();
    if (!dirUri) return;

    await deleteIfExists(dirUri, filename);

    const base64 = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64
    });

    try {
        const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            dirUri,
            filename,
            mimetype
        );

        await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64
        });

        openFileWithDefaultApp(fileUri, mimetype);
    } catch (err) {
        console.log("SAVE ERROR:", err);
    }
};

export const downloadFile = async (url, format, filename="") => {
    if(!filename) filename = url.split("/").at(-1);

    const { exists, foundUri } = await checkFileExists(filename);

    if (exists) {
        format = getMimeType(format);
        openFileWithDefaultApp(foundUri, format);
    } else {
        const result = await FileSystem.downloadAsync(
            url,
            FileSystem.documentDirectory + filename
        );
        saveFile(result.uri, filename, format, url);
    }
};

export const deleteIfExists = async (dirUri, filename) => {
    try {
        const files =
            await FileSystem.StorageAccessFramework.readDirectoryAsync(dirUri);

        const foundUri = files.find(uri => {
            const decoded = decodeURIComponent(uri);
            return decoded.endsWith("/" + filename);
        });

        if (foundUri)
            await FileSystem.StorageAccessFramework.deleteAsync(foundUri);
    } catch (e) {
        console.log("Delete check error:", e);
    }
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

export const openFileInBrowser = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
        await Linking.openURL(url);
    } else {
        ToastAndroid.show(
            `Don't know how to open this URL: ${url}`,
            ToastAndroid.LONG
        );
    }
};
