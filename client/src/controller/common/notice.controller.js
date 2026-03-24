import axios from "@utils/axios.js";
import { useAppStore } from "@store/app.store.js";

export const fetchNotices = async page => {
    try {
        const { course = "", year = "" } = useAppStore.getState().user ?? {};
        const { data } = await axios.post("/notice/list", {
            page,
            limit: 15,
            course,
            year
        });
        if (data.success) return data;
        return { success: false, notices: [], hasMore: false, nextPage: null };
    } catch {
        return { success: false, notices: [], hasMore: false, nextPage: null };
    }
};
