import axios from "axios";

export const fetchStudentsByClass = async data => {
    try {
        const res = await axios.post("/student/fetchStudentsByClass", data);

        console.log(res.data);
    } catch (error) {
        console.error(error);
    }
};
