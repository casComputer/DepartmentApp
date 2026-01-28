import axios from "@utils/axios.js";
import {
    ToastAndroid
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import orgAxios from "axios";

import {
    useAppStore
} from "@store/app.store.js"

const setProgressText = useAppStore.getState().setGlobalProgressText
const setProgress = useAppStore.getState().setGlobalProgress

export const handleDocumentPick = async (types = []) => {
    const result = await DocumentPicker.getDocumentAsync({
        type: types
    });

    if (result.canceled) return null;

    const {
        name,
        size,
        uri,
        mimeType
    } = result.assets[0];

    if (!name || !uri || !mimeType || !size) {
        ToastAndroid.show(
            "Failed to retrieve file information. Please try again.",
            ToastAndroid.LONG
        );
        return null;
    }

    const MAX_MB = 10;
    const sizeInMB = size / (1024 * 1024);

    if (sizeInMB > MAX_MB) {
        ToastAndroid.show(
            "File size exceeds 10MB limit. Please select a smaller file.",
            ToastAndroid.LONG
        );
        return null;
    }

    const isValid = types.some(type =>
        new RegExp("^" + type.replace("*", ".*") + "$").test(mimeType)
    );

    if (!isValid) {
        ToastAndroid.show("Invalid file type selected.", ToastAndroid.LONG);
        return null;
    }

    return {
        uri,
        name,
        size,
        mimeType
    };
};

export const handleUpload = async (file, preset_type) => {
    try {
        if (!file) {
            ToastAndroid.show("Please select a file.", ToastAndroid.SHORT);
            return {
                success: false
            };
        }
        if (!preset_type) {
            ToastAndroid.show("Invalid preset!", ToastAndroid.SHORT);
            return {
                success: false
            };
        }

        const url = `https://api.cloudinary.com/v1_1/dqvgf5plc/auto/upload`;

        const formData = new FormData();
        formData.append("file", {
            uri: file.uri,
            name: file.name,
            type: file.mimeType
        });

        setProgressText('generating signature...')

        const signatureRes = await axios.post("/file/getSignature", {
            preset_type
        });

        const {
            timestamp,
            signature,
            api_key,
            preset
        } = signatureRes.data;

        if (!timestamp || !signature || !api_key || !preset) {
            ToastAndroid.show(
                "Failed to generate signature. Please try again.",
                ToastAndroid.LONG
            );
            return {
                success: false
            };
        }

        formData.append("timestamp", timestamp);
        formData.append("upload_preset", preset);
        formData.append("signature", signature);
        formData.append("api_key", api_key);

        setProgressText('uploading file...')

        const res = await orgAxios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },

            onUploadProgress: pe => {
                const total = pe.total || file.size * 1.35; // 35% extra for multipart
                const percent = Math.min(
                    Math.round((pe.loaded / total) * 100),
                    100
                );
                if (percent > 1) setProgress(percent);
            }
        });

        const {
            secure_url, format, public_id
        } = res.data;
        
        if (!secure_url || !format || !public_id) {
                ToastAndroid.show("Failed to upload the file!", ToastAndroid.SHORT);
                return {
                success: false
            };
            }


        return {
            secure_url,
            format,
            public_id,
            success: true
        };
    } catch (error) {
        ToastAndroid.show(
            "Failed to upload file. Please try again.",
            ToastAndroid.LONG
        );
        setProgress(0);
        console.error("Error uploading to Cloudinary:",
            error);
        return {
            success: false
        };
    }
};