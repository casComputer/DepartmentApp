import axios from "@utils/axios.js";
import {
    toast
} from "@store/app.store.js";

export const fetchWorklogs = async (page, teacherId) => {
    try {
        const response = await axios.post("/teacher/getWorklogs", {
            teacherId,
            page,
            limit: 25
        });

        if (response.data.success) {
            return response.data;
        } else {
            toast.error("Failed to fetch worklogs");
            return {
                data: [],
                nextPage: null,
                hasMore: false
            };
        }
    } catch (error) {
        toast.error("Failed to fetch worklogs");
        return {
            data: [],
            nextPage: null,
            hasMore: false
        };
    }
};