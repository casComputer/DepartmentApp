import { ToastAndroid } from "react-native";

import axios from "@utils/axios.js";
import queryClient from "@utils/queryClient.js";

import { useAppStore } from "@store/app.store.js";
import { setNotes } from "@storage/app.storage.js";

export const fetchNotes = async ({ queryKey }) => {
    const parentId = queryKey[1] ?? null;
    const teacherId = useAppStore.getState().user.userId;

    if (!teacherId) return { notes: [], success: true };

    try {
        const res = await axios.post("/notes/fetchByTeacher", {
            teacherId,
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

export const create = async data => {
    try {
        const teacherId = useAppStore.getState().user.userId;
        if (!teacherId) return;

        data.teacherId = teacherId;

        const res = await axios.post("notes/create", data);

        if (res.data.success) {
            if (data.parentId === null) {
                queryClient.setQueryData(["notes"], prev => ({
                    ...prev,
                    notes: [...(prev?.notes ?? []), res.data.note]
                }));

                // mmkv storage
                setNotes("root", queryClient.getQueryData(["notes"])); // root notes
            } else {
                queryClient.setQueryData(["notes", data.parentId], prev => ({
                    ...prev,
                    notes: [...(prev?.notes ?? []), res.data.note]
                }));

                setNotes(
                    data.parentId,
                    queryClient.getQueryData(["notes", data.parentId])
                );
            }
        } else ToastAndroid.show(res.data.message, ToastAndroid.LONG);
    } catch (error) {
        if (error.message?.includes("Network Error")) {
            ToastAndroid.show(
                "Please connect to the internet 🛰️",
                ToastAndroid.LONG
            );
        } else {
            ToastAndroid.show(
                "Failed to create notes folder!",
                ToastAndroid.LONG
            );
        }
    }
};

export const uploadFileDetails = async data => {
    try {
        const teacherId = useAppStore.getState().user.userId;
        if (!teacherId) return;

        data.teacherId = teacherId;
        const res = await axios.post("/notes/upload", data);

        if (res.data.success) {
            const { file } = res.data;

            queryClient.setQueryData(["notes", file.parentId], prev => ({
                ...prev,
                notes: [...(prev.notes ?? []), file]
            }));

            setNotes(
                data.parentId,
                queryClient.getQueryData(["notes", file.parentId])
            );
        } else
            ToastAndroid.show(
                res.data.message ?? "Failed to Uplaod file data!",
                ToastAndroid.SHORT
            );
    } catch (error) {
        console.error(error);
        ToastAndroid.show("Failed to Uplaod file data!", ToastAndroid.SHORT);
    }
};
