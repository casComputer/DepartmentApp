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
        
        console.log(res.data);

        if (res.success) return res.data;
        else {
            ToastAndroid.show(
                res.data?.message ?? "Failed to fetch internal!",
                ToastAndroid.LONG
            );
            return {};
        }
    } catch (error) {
        ToastAndroid.show("Failed to fetch internal!", ToastAndroid.LONG);
        console.error(error);
        return {};
    }
};
