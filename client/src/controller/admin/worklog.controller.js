import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";

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
            ToastAndroid.show("Failed to fetch worklogs", ToastAndroid.SHORT);
            return {
                data: [],
                nextPage: null,
                hasMore: false
            };
        }
    } catch (error) {
        ToastAndroid.show("Failed to fetch worklogs", ToastAndroid.SHORT);
        return {
            data: [],
            nextPage: null,
            hasMore: false
        };
    }
};
