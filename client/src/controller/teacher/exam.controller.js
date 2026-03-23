import axios from "@utils/axios.js";
import {
    toast
} from "@store/app.store";

export const fetchExamResult = async ({
    course, sem
}) => {
    try {
        const res = await axios.post("/teacher/fetchExamResult", {
            course,
            sem,
        });
        if (res.data.success) return res.data.results;
        else {
            toast.error(
                "Failed to fetch exam results",
                res.data.message ?? ""
            );
            return [];
        }
    } catch (error) {
        toast.error(
            "Failed to fetch exam results"
        );
        return [];
    }
};