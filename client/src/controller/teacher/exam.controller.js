import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";

export const fetchExamResult = async ({ course, sem }) => {
    try {
        const res = await axios.post("/teacher/fetchExamResult", {
            course,
            sem,
        });
        if (res.data.success) return res.data.results;
        else {
            ToastAndroid.show(
                res.data.message ?? "Failed to fetch exam results",
                ToastAndroid.LONG,
            );
            return [];
        }
    } catch (error) {
        return [];
    }
};
