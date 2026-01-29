import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";

export const fetchStudentsByClass = async ({ course, year }) => {
    try {
        if (!course || !year)
            return {
                students: [],
                numberOfStudents: 0,
                success: true,
                course,
                year,
            };

        const res = await axios.post("auth/getStudentsForParents", {
            course,
            year,
        });

        return res.data;
    } catch (error) {
        ToastAndroid.show("Failed to fetch students", ToastAndroid.LONG);
        if (!course || !year)
            return {
                students: [],
                numberOfStudents: 0,
                success: true,
                course,
                year,
            };
    }
};
