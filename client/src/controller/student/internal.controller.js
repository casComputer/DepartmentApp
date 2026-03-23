import axios from "@utils/axios";

import {
    useAppStore,
    toast
} from "@store/app.store.js";

export const fetchInternal = async page => {
    try {
        const course = useAppStore.getState().user?.course;

        const res = await axios.post("/student/getInternalMarks", {
            page,
            limit: 15,
            course
        });

        if (res.data?.success) return res.data;

        toast.error(
            "Failed to fetch internal marks",
            res.data?.message ?? ""
        );
        return {
            internals: [],
            nextPage: null
        };
    } catch (error) {
        toast.error("Failed to fetch internal marks");

        return {
            internals: [],
            nextPage: null
        };
    }
};