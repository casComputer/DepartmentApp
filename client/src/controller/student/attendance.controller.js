import axios from "@utils/axios";
import { ToastAndroid } from "react-native";

import { useAppStore } from "@store/app.store.js";

export const getTodaysAttendanceReport = async () => {
    try {
        const userId = useAppStore.getState().user?.userId;
        console.log(useAppStore.getState().user);
        if (!userId) return;

        const res = await axios.post("/student/getTodaysAttendanceReport", {
            userId
        });

        if (res.data.success) return res.data.attendance;
        else {
            ToastAndroid.show(
                "Syncing today's attendance failed",
                ToastAndroid.LONG
            );
            return {};
        }
    } catch (error) {
        console.error(error);
        ToastAndroid.show(
            `Syncing today's attendance failed: ${error.message}`,
            ToastAndroid.LONG
        );
        throw new Error(error.message);
    }
};
