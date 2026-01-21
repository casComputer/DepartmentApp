import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";

export const fetchExamResult = async ({ course, year, sem }) => {
    try {
        console.log(course, year, sem);
        const res = await axios.post("/teacher/fetchExamResult", {
            course,
            year,
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
        console.log(error);
        throw error;
        return [];
    }
};
