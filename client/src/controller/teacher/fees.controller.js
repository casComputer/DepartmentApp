import { ToastAndroid } from "react-native";

import axios from "@utils/axios.js";

import { useAppStore } from "@store/app.store.js";

export const create = async ({ course, year, details, amount, dueDate }) => {
    try {
        const { userId, role } = useAppStore.getState().user;

        if (
            !userId ||
            !course ||
            !year ||
            !details ||
            !amount ||
            !role ||
            !dueDate
        ) {
            ToastAndroid.show("Missing required values!", ToastAndroid.LONG);
            return false;
        }

        ToastAndroid.show("please wait ⏳", ToastAndroid.SHORT);

        const res = await axios.post("/fees/create", {
            userId,
            course,
            year,
            details,
            amount,
            role,
            dueDate
        });

        if (res.data.success) {
            ToastAndroid.show(
                "Fees Details Updated Successfully ✨",
                ToastAndroid.SHORT
            );
            return true;
        } else {
            ToastAndroid.show(
                res.data.message ?? "Fees Details Updation Failed",
                ToastAndroid.LONG
            );
            return false;
        }
    } catch (error) {
        ToastAndroid.show("Fees Details Updation Failed", ToastAndroid.LONG);
        console.error(error);
        return false;
    }
};

export const fetch = async page => {
    try {
        const { userId, role } = useAppStore.getState().user;

        if (!userId || !role) {
            ToastAndroid.show("Missing required values!", ToastAndroid.LONG);
            return { success: false, hasMore: true, page, fees: [] };
        }

        const res = await axios.post("/fees/fetchByTeacher", {
            userId,
            role,
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
        console.error(error);
        return { success: false, hasMore: true, page, fees: [] };
    }
};
