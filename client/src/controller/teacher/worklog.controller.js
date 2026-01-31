import axios from "@utils/axios.js";

import { useAppStore } from "@store/app.store.js";
import { ToastAndroid } from "react-native";

export const saveWorklog = async ({
    year,
    course,
    date,
    hour,
    subject,
    topics
}) => {
    try {
        if (
            !year ||
            !course ||
            !date ||
            !hour ||
            !subject ||
            topics.length === 0
        ) {
            throw new Error("All fields are required to save the worklog.");
        }

        const user = useAppStore.getState().user;

        const worklogData = {
            year,
            course,
            date,
            hour,
            subject,
            topics,
            teacherId: user.userId
        };
        const response = await axios.post("/teacher/saveWorklog", worklogData);

        if (response.data.success) {
            ToastAndroid.show(
                "Worklog saved successfully.",
                ToastAndroid.SHORT
            );
        }
        ToastAndroid.show(
            response.data.message ?? "Failed to save Worklog",
            ToastAndroid.LONG
        );
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) {
            ToastAndroid.show(
                error.response.data.message ?? "Failed to save Worklog",
                ToastAndroid.LONG
            );
        } else {
            throw error;
        }
    }
};

export const fetchWorklogs = async page => {
    try {
        const user = useAppStore.getState().user;

        const response = await axios.post("/teacher/getWorklogs", {
            teacherId: user.userId,
            page,
            limit: 5
        });

        if (response.data.success) {
            return response.data;
        }
        ToastAndroid.show(
            response.data.message ?? "Failed to fetch Worklog",
            ToastAndroid.LONG
        );
        return {
            data: [],
            hasMore: false,
            nextPage: undefined,
            success: false
        };
    } catch (error) {
        ToastAndroid.show("Failed to fetch Worklog", ToastAndroid.LONG);
        return {
            data: [],
            hasMore: false,
            nextPage: undefined,
            success: false
        };
    }
};
