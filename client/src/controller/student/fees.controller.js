import { ToastAndroid } from "react-native";

import axios from "@utils/axios.js";
import { useAppStore } from "@store/app.store.js";

export const fetch = async page => {
    try {
        const { course, year } = useAppStore.getState().user;
        
        console.log(course, year)
        
        if (!course || !year) {
            ToastAndroid.show("Missing required values!", ToastAndroid.LONG);
            return { success: false, hasMore: true, page, fees: [] };
        }

        const res = await axios.post("/fees/fetchByStudent", {
            course,
            year,
            page,
            limit: 15
        });

        if (res.data.success) {
            return res.data;
        } else {
            ToastAndroid.show(
                res.data.message ?? "Fees fetching Failed",
                ToastAndroid.LONG
            );

            return { success: false, hasMore: true, page, fees: [] };
        }
    } catch (error) {
        ToastAndroid.show("Fees fetching Failed", ToastAndroid.LONG);
        return { success: false, hasMore: true, page, fees: [] };
    }
};
