import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import orgAxios from "axios";

export const handleDocumentPick = async setFormData => {
    const result = await DocumentPicker.getDocumentAsync({
        types: [
            "application/pdf",
            "image/*",
            "application/vnd.ms-powerpoint", // .ppt
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" // .pptx
        ]
    });

    if (result.canceled) {
        return null;
    } else {
        const { name, size, uri, mimeType } = result.assets[0];

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

        const allowedExt = [
            "application/pdf",
            "image/jpg",
            "image/jpeg",
            "image/png",
            "application/vnd.ms-powerpoint", // .ppt
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" // .pptx
        ];

        if (!allowedExt.includes(mimeType)) {
            ToastAndroid.show(
                "Invalid file type. Please select a PDF, image, or PowerPoint file.",
                ToastAndroid.LONG
            );
            return null;
        }

        return { uri, name, size, mimeType };
    }
};

export const handleUpload = async (file, setProgress) => {
    try {
        if (!file) {
            ToastAndroid.show("Please select a file.", ToastAndroid.SHORT);
            return null;
        }
        const url = `https://api.cloudinary.com/v1_1/dqvgf5plc/auto/upload`;

        const formData = new FormData();
        formData.append("file", {
            uri: file.uri,
            name: file.name,
            type: file.mimeType
        });

        const signatureRes = await axios.post("/file/getSignature", {
            preset_type: "note"
        });

        const { timestamp, signature, api_key, preset } = signatureRes.data;

        if (!timestamp || !signature || !api_key || !preset) {
            ToastAndroid.show(
                "Failed to generate signature. Please try again.",
                ToastAndroid.LONG
            );
            return false;
        }

        formData.append("timestamp", timestamp);
        formData.append("upload_preset", preset);
        formData.append("signature", signature);
        formData.append("api_key", api_key);

        const res = await orgAxios.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },

            onUploadProgress: pe => {
                const total = pe.total || file.size * 1.35; // 35% extra for multipart
                const percent = Math.min(
                    Math.round((pe.loaded / total) * 100),
                    100
                );
                setProgress(percent);
            }
        });

        const { secure_url, format, public_id } = res.data;

        return {
            secure_url,
            format,
            public_id
        };
    } catch (error) {
        ToastAndroid.show(
            "Failed to upload file. Please try again.",
            ToastAndroid.LONG
        );
        console.error("Error uploading to Cloudinary:", error);
        return false;
    }
};
