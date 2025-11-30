import axios from "@utils/axios";
import { ToastAndroid } from "react-native";

import { useAppStore } from "@store/app.store.js";

export const getTodaysAttendanceReport = async () => {
    try {
        const userId = useAppStore.getState().user?.userId;
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

export const getMonthlyAttendenceMiniReport = async () => {
    try {
        const userId = useAppStore.getState().user?.userId;
        if (!userId) return;

        const res = await axios.post(
            "/student/getMonthlyAttendanceMiniReport",
            {
                userId
            }
        );

        if (res.data.success) return res.data.report;
        else {
            ToastAndroid.show(
                "Failed to fetching monthly attendance report!",
                ToastAndroid.LONG
            );
            throw new Error("Failed to fetching monthly attendance report!");
            return {};
        }
    } catch (error) {
        console.error(error);
        ToastAndroid.show(
            `Failed to fetching monthly attendance report!`,
            ToastAndroid.LONG
        );
        throw new Error(error.message);
    }
};
