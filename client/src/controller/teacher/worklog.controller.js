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
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) {
            ToastAndroid.show(error.response.data.message, ToastAndroid.LONG);
        } else {
            console.error("Error saving worklog:", error);
            throw error;
        }
    }
};

export const fetchWorklogs = async page => {
    try {
        const user = useAppStore.getState().user;

        const response = await axios.post("/teacher/getWorklogs", {
            userId: user.userId,
            page,
            limit: 5
        });

        if (response.data.success) {
            console.log(response.data);
            return response.data;
        } else {
            throw new Error("Failed to fetch worklogs.");
        }
    } catch (error) {
        console.error("Error fetching worklogs:", error);
        throw error;
    }
};
