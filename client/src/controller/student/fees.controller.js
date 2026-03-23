import axios from "@utils/axios.js";
import {
    useAppStore,
    toast
} from "@store/app.store.js";

export const fetch = async page => {
    try {
        const {
            course,
            year
        } = useAppStore.getState().user;

        if (!course || !year) {
            toast.warn("Missing required values!");
            return {
                success: false,
                hasMore: true,
                page,
                fees: []
            };
        }

        const res = await axios.post("/fees/fetchByStudent", {
            course,
            year,
            page,
            limit: 15
        });

        if (res.data.success) {
            return res.data;
        } else {
            toast.error(
                "Failed to fetch fee details",
                res.data.message ?? ""
            );

            return {
                success: false,
                hasMore: true,
                page,
                fees: []
            };
        }
    } catch (error) {
        toast.error("Failed to fetch fee details");
        return {
            success: false,
            hasMore: true,
            page,
            fees: []
        };
    }
};