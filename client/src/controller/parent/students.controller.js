import axios from "@utils/axios.js";
import {
    toast
} from "@store/app.store";

export const fetchStudentsByClass = async ({
    course, year
}) => {
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
        toast.error("Failed to fetch students");
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