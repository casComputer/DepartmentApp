import axios from "@utils/axios.js";

import { useAppStore } from "@store/app.store.js";

export const syncUser = async () => {
    try {
        const userId = useAppStore.getState().user.userId;
        if (!userId) return;

        const response = await axios.post("/teacher/getTeacherInfo", {
            userId,
        });

        if (response.data.success) {
            useAppStore.getState().updateUser(response.data.info);
        }

        return response.data;
    } catch (error) {
        console.error("Error syncing user:", error);
        throw error;
    }
};
