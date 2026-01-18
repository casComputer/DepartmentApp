import { ToastAndroid } from "react-native";

import axios from "@utils/axios.js";
import queryClient from "@utils/queryClient.js";

import { useAppStore } from "@store/app.store.js";

export const create = async ({ course, year, details, amount, dueDate }) => {
    try {
        if (!course || !year || !details || !amount || !dueDate) {
            ToastAndroid.show("Missing required values!", ToastAndroid.LONG);
            return false;
        }

        ToastAndroid.show("please wait ⏳", ToastAndroid.SHORT);

        const res = await axios.post("/fees/create", {
            course,
            year,
            details,
            amount,
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
        const res = await axios.post("/fees/fetchByTeacher", {
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

export const deleteFee = async feeId => {
    try {
        queryClient.setQueryData(["fees"], oldData => {
            if (!oldData) return oldData;

            return {
                ...oldData,
                pages: oldData.pages.map(page => ({
                    ...page,
                    fees: page?.fees?.filter(fee => fee?.feeId !== feeId)
                }))
            };
        });

        const { data } = await axios.post("/fees/delete", {
            feeId
        });

        if (!data.success) {
            ToastAndroid.show(
                data?.message ?? "Failed to delete fee item!",
                ToastAndroid.LONG
            );
        }
    } catch (error) {
        console.error(error);
        ToastAndroid.show("Failed to delete fee item!", ToastAndroid.LONG);
    }
};
