import axios from "@utils/axios.js";
import {
    ToastAndroid
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import orgAxios from "axios";

import {
    useAppStore
} from "@store/app.store.js";

import {
    getRandomSubmitMessage
} from "@utils/displayMessages.js";

export const getAssignment = async ({
    pageParam
}) => {
    try {
        const {
            course,
            year
        } = useAppStore.getState().user;

        if (!course || !year)
            return []

        const response = await axios.post(
            "/assignment/getAssignmentForStudent",
            {
                course,
                year,
                page: pageParam,
                limit: 15
            }
        );

        if (response.data.success)
            return response.data ??[]

        ToastAndroid.show(response.data?.message ?? "Failed to fetch assignments", ToastAndroid.LONG);
        return response.data ?? [];
    } catch (error) {
        ToastAndroid.show("Failed to fetch assignments", ToastAndroid.LONG);
        return []
    }
};

export const handleDocumentPick = async setFormData => {
    const result = await DocumentPicker.getDocumentAsync({
        types: ["application/pdf", "image/*"]
    });

    if (result.canceled) {
        return;
    } else {
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
            return;
        }

        const MAX_MB = 10;
        const sizeInMB = size / (1024 * 1024);

        if (sizeInMB > MAX_MB) {
            ToastAndroid.show(
                "File size exceeds 10MB limit. Please select a smaller file.",
                ToastAndroid.LONG
            );
            return;
        }

        const allowedExt = [
            "application/pdf",
            "image/jpg",
            "image/jpeg",
            "image/png"
        ];

        if (!allowedExt.includes(mimeType)) {
            ToastAndroid.show(
                "Invalid file type. Please select a PDF or image file.",
                ToastAndroid.LONG
            );

            return;
        }

        setFormData({
            uri, name, size, mimeType
        });
    }
};

const saveAssignmentSubmissionDetails = async ({
    secure_url,
    format,
    assignmentId
}) => {
    try {
        const studentId = useAppStore.getState().user.userId;
        if (!studentId) {
            ToastAndroid.show("Missing login informations!", ToastAndroid.LONG);
            return false;
        }

        ToastAndroid.show("Please wait...", ToastAndroid.SHORT);

        const res = await axios.post(
            "/assignment/saveAssignmentSubmissionDetails",
            {
                studentId,
                secure_url,
                format,
                assignmentId
            }
        );

        if (res?.data?.success) {
            ToastAndroid.show(getRandomSubmitMessage(), ToastAndroid.SHORT);
            return true;
        } else {
            ToastAndroid.show(
                res.data?.message || "Failed to upload file. Please try again.",
                ToastAndroid.LONG
            );
            return false;
        }
    } catch (error) {
        console.error(error);
        ToastAndroid.show(
            "Failed to upload file. Please try again.",
            ToastAndroid.LONG
        );
        return false;
    }
};

export const handleAssignmentUpload = async (
    file,
    assignmentId,
    setProgress
) => {
    try {
        if (!file) {
            ToastAndroid.show("Please select a file.", ToastAndroid.SHORT);
            return false;
        }
        const url = `https://api.cloudinary.com/v1_1/dqvgf5plc/auto/upload`;

        const formData = new FormData();
        formData.append("file", {
            uri: file.uri,
            name: file.name,
            type: file.mimeType
        });

        const signatureRes = await axios.post("/file/getSignature", {
            preset_type: "assignment"
        });

        if (!signatureRes.data.success) {
            ToastAndroid.show(signatureRes.data.message, ToastAndroid.SHORT);
            return false;
        }

        const {
            timestamp,
            signature,
            api_key,
            preset
        } = signatureRes.data;

        if (!timestamp || !signature || !api_key || !preset) {
            ToastAndroid.show(
                "Unable to generate signature. Please try again.",
                ToastAndroid.LONG
            );
            return false;
        }

        formData.append("timestamp", timestamp);
        formData.append("upload_preset", preset);
        formData.append("signature", signature);
        formData.append("api_key", api_key);

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
                if (progress > 1) setProgress(percent);
            }
        });

        const {
            secure_url, format
        } = res.data;

        return await saveAssignmentSubmissionDetails( {
            secure_url,
            format,
            assignmentId
        });
    } catch (error) {
        ToastAndroid.show(
            "Failed to upload file. Please try again.",
            ToastAndroid.LONG
        );
        console.error("Error uploading to Cloudinary:",
            error);
        return false;
    }
};