import axios from "@utils/axios.js";
import {
    ToastAndroid
} from "react-native";

export const handleSaveResultDetails = async (data) => {
    try {
        const res = await axios.post("/student/saveExamResultDetails", {
            data,
        });

        if (res.data.success)
            ToastAndroid.show(
            "Exam result uploaded successfull ✨",
            ToastAndroid.SHORT,
        );
        else
            ToastAndroid.show(
            res.data.message ?? "Failed to upload exam result!",
            ToastAndroid.LONG,
        );
    } catch (e) {
        ToastAndroid.show("Failed to upload exam result!", ToastAndroid.LONG);
    }
};

export const checkExamResultUpload = async (course, sem) => {
    try {
        const res = await axios.post("/student/checkExamResultUpload", {
            course,
            sem,
        });

        if (res.data.success) return res.data.uploaded;

        ToastAndroid.show(
            res.data.message ?? "Failed to check exam result upload!",
            ToastAndroid.LONG,
        );
        return false;
    } catch (e) {
        ToastAndroid.show("Failed to check exam result upload!", ToastAndroid.LONG);
        return false;
    }
};