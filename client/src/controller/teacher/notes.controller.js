import { ToastAndroid } from "react-native";

import axios from "@utils/axios.js";
import queryClient from "@utils/queryClient.js";
import { deleteIfExists, ensureDirectoryPermission } from "@utils/file.js";

import { useAppStore, useMultiSelectionList } from "@store/app.store.js";
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
            queryClient.setQueryData(["notes", data.parentId], prev => ({
                ...prev,
                notes: [...(prev?.notes ?? []), res.data.note]
            }));

            // mmkv storage
            setNotes(
                data.parentId ?? "root",
                queryClient.getQueryData(["notes", data.parentId])
            ); // root notes
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

export const deleteNotes = async () => {
    try {
        const teacherId = useAppStore.getState().user.userId;
        if (!teacherId) return;

        const noteIds = useMultiSelectionList.getState().list;
        if (noteIds?.length <= 0) return;

        ToastAndroid.show("please wait...", ToastAndroid.SHORT);

        const res = await axios.post("/notes/delete", { noteIds, teacherId });

        if (res.data.success) {
            const { validRoots, fileNotes } = res.data;

            validRoots.forEach(root => {
                queryClient.setQueryData(["notes", root.parentId], prev => ({
                    ...prev,
                    notes: prev.notes.filter(note => note._id !== root._id)
                }));

                setNotes(
                    root.parentId ?? "root",
                    queryClient.getQueryData(["notes", root.parentId])
                );
            });

            useMultiSelectionList.getState().clear();
            
            const dirUri = await ensureDirectoryPermission();
            if (dirUri && fileNotes.length > 0) {
                for (let file of fileNotes) {
                    
                    deleteIfExists(dirUri, file.name)
                }
            }

        } else
            ToastAndroid.show(
                res.data.message ?? "Failed to delete file!",
                ToastAndroid.LONG
            );
    } catch (error) {
        console.error(error);
        ToastAndroid.show("Failed to delete file!", ToastAndroid.LONG);
    }
};
