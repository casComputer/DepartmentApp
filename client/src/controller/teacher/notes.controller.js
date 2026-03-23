import axios from "@utils/axios.js";
import queryClient from "@utils/queryClient.js";
import {
    deleteFileEverywhere,
    ensureDirectoryPermission
} from "@utils/file.js";

import {
    useAppStore,
    useMultiSelectionList,
    toast
} from "@store/app.store.js";
import {
    setNotes
} from "@storage/app.storage.js";

export const fetchNotes = async ({
    queryKey, pageParam
}) => {
    const parentId = queryKey[1] ?? null;

    try {
        const res = await axios.post("/notes/fetchByTeacher", {
            parentId,
            page: pageParam,
            limit: 20
        });

        if (!res.data?.success) {
            toast.error(
                "Failed to fetch notes"
            );
            return {
                notes: [],
                hasMore: false,
                nextPage: null,
                success: false
            };
        }

        setNotes(parentId ?? "root", res.data);
        return res.data;
    } catch (error) {
        if (error.message?.includes("Network Error")) {
            toast.error(
                "Please connect to the internet 🛰️"
            );
        } else toast.error("Failed to Sync notes");

        return {
            notes: [],
            hasMore: false,
            nextPage: null,
            success: false
        };
    }
};

export const create = async data => {
    try {
        const teacherId = useAppStore.getState().user.userId;
        if (!teacherId) return;
        data.teacherId = teacherId;

        const res = await axios.post("notes/create", data);

        if (res.data.success) {
            queryClient.setQueryData(["notes", data.parentId], prev => {
                if (!prev) return prev;

                const newPages = [...prev.pages];
                newPages[0] = {
                    ...newPages[0],
                    notes: [res.data.note,
                        ...(newPages[0].notes ?? [])]
                };

                return {
                    ...prev,
                    pages: newPages
                };
            });

            // mmkv storage
            setNotes(
                data.parentId ?? "root",
                queryClient.getQueryData(["notes", data.parentId])
            ); // root notes
        } else toast.error("Failed to create notes folder", res.data.message ?? "");
    } catch (error) {
        if (error.message?.includes("Network Error")) {
            toast.error(
                "Please connect to the internet 🛰️",
            );
        } else {
            toast.error(
                "Failed to create notes folder!",
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
            const {
                file
            } = res.data;

            queryClient.setQueryData(["notes", data.parentId], prev => ({
                ...prev,
                notes: [...(prev.notes ?? []), file]
            }));

            setNotes(
                data.parentId,
                queryClient.getQueryData(["notes", file.parentId])
            );
        } else {

            toast.error(
                "Failed to Uplaod file data!",
                res.data.message ?? ""
            );
        }
    } catch (error) {
        toast.error("Failed to Uplaod file data");
    }
};

export const deleteNotes = async () => {
    try {
        const teacherId = useAppStore.getState().user.userId;
        if (!teacherId) return;

        const noteIds = useMultiSelectionList.getState().list;
        if (noteIds?.length <= 0) return;

        toast.info("please wait...",);

        const res = await axios.post("/notes/delete", {
            noteIds, teacherId
        });

        if (res.data.success) {
            const {
                validRoots,
                fileNotes
            } = res.data;

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

            if (fileNotes.length > 0)
                for (let file of fileNotes)
                await deleteFileEverywhere(file.name);
        } else {
            toast.error(
                'Failed to delete file',
                res.data.message ?? "",
            );
        }
    } catch (error) {
        toast.error("Failed to delete file!");
    }
};