import axios from "@utils/axios";
import { ToastAndroid } from 'react-native'

import { useAppStore } from "@store/app.store.js";

export const fetchInternal = async page => {
    try {
        const course = useAppStore.getState().user?.course;

        const res = await axios.post("/student/getInternalMarks", {
            page,
            limit: 15,
            course
        });

        if (res.data?.success) return res.data;

        ToastAndroid.show(
            res.data?.message ?? "Failed to fetch internal!",
            ToastAndroid.LONG
        );
        return {
            internals: [],
            nextPage: null
        };
    } catch (error) {
        ToastAndroid.show("Failed to fetch internal!", ToastAndroid.LONG);
        console.error(error);
        return {
            internals: [],
            nextPage: null
        };
    }
};
