import axios from "@utils/axios.js";
import * as DocumentPicker from "expo-document-picker";
import orgAxios from "axios";

import {
    useAppStore,
    toast
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

        if (!course || !year) return [];

        const response = await axios.post(
            "/assignment/getAssignmentForStudent",
            {
                course,
                year,
                page: pageParam,
                limit: 15
            }
        );

        if (response.data.success) return response.data ?? [];

        toast.error(
            "Failed to fetch assignments",
            response.data?.message ?? ""
        );
        return response.data ?? [];
    } catch (error) {
        toast.error("Failed to fetch assignments");
        return [];
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
            toast.error(
                "Failed to retrieve file information. Please try again."
            );
            return;
        }

        const MAX_MB = 10;
        const sizeInMB = size / (1024 * 1024);

        if (sizeInMB > MAX_MB) {
            toast.warn(
                "File size exceeds 10MB limit. Please select a smaller file."
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
            toast.warn(
                "Invalid file type. Please select a PDF or image file.",
            );

            return;
        }

        setFormData({
            uri,
            name,
            size,
            mimeType
        });
    }
};

const saveAssignmentSubmissionDetails = async ({
    secure_url,
    format,
    assignmentId,
    public_key
}) => {
    try {

        const res = await axios.post(
            "/assignment/saveAssignmentSubmissionDetails",
            {
                secure_url,
                format,
                assignmentId,
                public_key
            }
        );

        if (res?.data?.success) {
            toast.success(
                "Assignment successfully submitted",
                getRandomSubmitMessage() ??
                ""
            );
            return true;
        } else {
            toast.error(
                "Failed to upload file",
                res.data?.message ?? ""
            );
            return false;
        }
    } catch (error) {
        toast.error(
            "Failed to upload file. Please try again.",
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
            toast.warn("Please select a file.");
            return false;
        }
        const url = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_URL;

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
            toast.error(
                "Failed to generate signature",
                signatureRes.data.message ?? ""
            );
            return false;
        }

        const {
            timestamp,
            signature,
            api_key,
            preset
        } = signatureRes.data;

        if (!timestamp || !signature || !api_key || !preset) {
            toast.error(
                "Unable to generate signature. Please try again."
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
                if (percent > 1) setProgress(percent);
            }
        });

        const {
            secure_url, format, public_key
        } = res.data;

        return await saveAssignmentSubmissionDetails( {
            secure_url,
            format,
            assignmentId,
            public_key
        });
    } catch (error) {
        toast.error(
            "Failed to upload file. Please try again.",
        );

        return false;
    }
};