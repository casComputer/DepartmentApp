import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";
import { router } from "expo-router";

export const handleSave = async (data) => {
    try {
        const res = await axios.post("/teacher/saveInternalMarkDetails", {
            data,
        });

        if (res.data.success) {
            ToastAndroid.show(
                "Internal mark uploaded successfull ✨",
                ToastAndroid.SHORT,
            );
            router.back();
        } else
            ToastAndroid.show(
                res.data.message ?? "Failed to upload internal mark!",
                ToastAndroid.LONG,
            );
    } catch (e) {
        ToastAndroid.show("Failed to upload internal mark!", ToastAndroid.LONG);
        console.log(e, e?.message);
    }
};

export const checkExists = async (course, sem) => {
    try {
        const res = await axios.post("/teacher/checkInternalMarkUpload", {
            course,
            sem,
        });

        console.log(res.data)

        if (res.data.success) {
            if (res.data?.uploaded) {
                ToastAndroid.show(
                    "You already uploaded internal marks for this sem!",
                    ToastAndroid.SHORT,
                );
            }

            return {
                uploaded: res.data.uploaded,
                failed: false,
            };
        }

        ToastAndroid.show(
            res.data.message ?? "Failed to check existing internal marks!",
            ToastAndroid.LONG,
        );
        return {
            uploaded: false,
            failed: true,
        };
    } catch (e) {
        ToastAndroid.show(
            "Failed to check existing internal marks!",
            ToastAndroid.LONG,
        );
        return {
            uploaded: false,
            failed: true,
        };
    }
};

export const getHistory = async () => {
    try {
        const res = await axios.post("/teacher/getInternalMarkHistory");

        if (res.data.success) {
            console.log(res.data.history)
            return res.data.history ?? [];
        } else {
            ToastAndroid.show(
                res.data.message ?? "Failed to fetch history!",
                ToastAndroid.LONG,
            );
            return [];
        }
    } catch (e) {
        ToastAndroid.show("Failed to fetch history!", ToastAndroid.LONG);
        return [];
    }
};