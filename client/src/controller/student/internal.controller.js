import axios from "@utils/axios";

import { useAppStore } from "@store/app.store.js";

export const fetchInternal = async page => {
    try {
        const course = useAppStore.getState().user?.course;

        const res = await axios.post("/student/getInternalMarks", {
            page,
            limit: 15,
            course
        });

        if (res.success) return res.data;
        else {
            ToastAndroid.show("Failed to fetch internal!", ToastAndroid.LONG);
            return {};
        }
    } catch (error) {
        ToastAndroid.show("Failed to fetch internal!", ToastAndroid.LONG);
        console.error(error);
        return {};
    }
};
