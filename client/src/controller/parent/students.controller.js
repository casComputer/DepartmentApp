import axios from "@utils/axios.js";

export const fetchStudentsByClass = async ({ course, year }) => {
    try {
        if (!course || !year) throw new Error("course and year not found.");

        const res = await axios.post("/student/fetchStudentsByClass", {
            course,
            year
        });

        return res.data;
    } catch (error) {
        throw new Error("Failed to fetch students");
        console.error("error while fetching students : ", error);
    }
};
