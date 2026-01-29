import { ToastAndroid } from "react-native";

import axios from "@utils/axios.js";
import queryClient from "@utils/queryClient.js";

import { useAppStore } from "@store/app.store.js";
import { setNotes } from "@storage/app.storage.js";

export const fetchNotes = async ({ queryKey }) => {
    const parentId = queryKey[1] ?? null;
    const { course, year } = useAppStore.getState().user;

    try {
        if (!course || !year) {
            ToastAndroid.show(
                "Missing course and year fields!",
                ToastAndroid.LONG
            );
            return { notes: [], success: true };
        }

        const res = await axios.post("/notes/fetchByStudent", {
            course,
            year,
            parentId
        });

        if (!res.data?.success) {
        ToastAndroid.show("Failed to Sync notes", ToastAndroid.SHORT);
            return { notes: [], success: false };
        }

        setNotes(parentId ?? "root", res.data);

        return res.data;
    } catch (error) {
        if (error.message?.includes("Network Error")) {
            if (!parentId)
                ToastAndroid.show(
                    "Please connect to the internet 🛰️",
                    ToastAndroid.LONG
                );
            return getNotes(parentId ?? "root") ?? { notes: [], success: true };
        }

        ToastAndroid.show("Failed to Sync notes", ToastAndroid.SHORT);
        return { notes: [], success: true };
    }
};
