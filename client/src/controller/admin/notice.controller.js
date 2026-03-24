import axios from "@utils/axios.js";
import queryClient from "@utils/queryClient.js";
import { toast } from "@store/app.store.js";

export const createNotice = async ({
    title,
    description,
    image,
    imagePublicId,
    target,
    year,
    course
}) => {
    try {
        const { data } = await axios.post("/notice/create", {
            title,
            description,
            image,
            imagePublicId,
            target,
            year: year?.id ?? null,
            course: course?.id ?? null
        });

        if (!data.success) {
            toast.error("Failed", data.message ?? "Could not send notice.");
            return { success: false };
        }

        // Prepend new notice to the first page of both query caches
        const prependToCache = key => {
            queryClient.setQueryData(key, prev => {
                if (!prev) return prev;

                const newPages = [...prev.pages];
                newPages[0] = {
                    ...newPages[0],
                    notices: [data.notice, ...(newPages[0].notices ?? [])]
                };

                return { ...prev, pages: newPages };
            });
        };

        prependToCache(["notices"]);

        toast.success("Notice Sent", "Your notice has been published.");
        return { success: true };
    } catch (error) {
        toast.error("Error", "Failed to send notice. Please try again.");
        return { success: false };
    }
};

export const deleteNotice = async noticeId => {
    try {
        const { data } = await axios.post("/notice/delete", { noticeId });

        if (!data.success) {
            toast.error("Failed", data.message ?? "Could not delete notice.");
            return { success: false };
        }

        // Remove the notice from both query caches
        const removeFromCache = key => {
            queryClient.setQueryData(key, prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    pages: prev.pages.map(page => ({
                        ...page,
                        notices: page.notices.filter(n => n._id !== noticeId)
                    }))
                };
            });
        };

        removeFromCache(["notices"]);

        toast.success("Deleted", "Notice removed successfully.");
        return { success: true };
    } catch (error) {
        toast.error("Error", "Failed to delete notice.");
        return { success: false };
    }
};

export const fetchAdminNotices = async page => {
    try {
        const { data } = await axios.post("/notice/admin/list", {
            page,
            limit: 15
        });

        if (data.success) return data;

        return { success: false, notices: [], hasMore: false, nextPage: null };
    } catch (error) {
        return { success: false, notices: [], hasMore: false, nextPage: null };
    }
};
