import { ToastAndroid } from "react-native";

import axios from "@utils/axios.js";
import queryClient from "@utils/queryClient.js";

import { useAppStore } from "@store/app.store.js";
import { setNotes } from "@storage/app.storage.js";

export const fetchNotes = async ({ queryKey }) => {
    const parentId = queryKey[1] ?? null;
    const student = useAppStore.getState().user;

    if (!student) return { notes: [], success: true };
        
    try {
        const { course, year_of_study } = student;

        if (!course || !year_of_study) {
            ToastAndroid.show(
                "Something went wrong. If the issue persist, please re-authenticate",
                ToastAndroid.LONG
            );
            return { notes: [], success: true };
        }

        const res = await axios.post("/notes/fetchByStudent", {
            course,
            year: year_of_study,
            parentId
        });

        if (!res.data?.success) {
            throw new Error("Failed to fetch notes");
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
