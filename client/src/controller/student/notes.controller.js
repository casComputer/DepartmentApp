import axios from "@utils/axios.js";
import queryClient from "@utils/queryClient.js";

import {
    useAppStore,
    toast
} from "@store/app.store.js";
import {
    setNotes
} from "@storage/app.storage.js";

export const fetchNotes = async ({
    queryKey
}) => {
    const parentId = queryKey[1] ?? null;
    const {
        course,
        year
    } = useAppStore.getState().user;

    try {
        if (!course || !year) {
            toast.warn(
                "Missing course and year fields!"
            );
            return {
                notes: [],
                success: true
            };
        }

        const res = await axios.post("/notes/fetchByStudent", {
            course,
            year,
            parentId
        });

        if (!res.data?.success) {
            toast.error("Failed to Sync notes");
            return {
                notes: [],
                success: false
            };
        }

        setNotes(parentId ?? "root", res.data);

        return res.data;
    } catch (error) {
        if (error.message?.includes("Network Error")) {
            if (!parentId)
                toast.error(
                "Please connect to the internet 🛰️",
            );
            return getNotes(parentId ?? "root") ?? {
                notes: [],
                success: true
            };
        }

        toast.error("Failed to Sync notes");
        return {
            notes: [],
            success: true
        };
    }
};