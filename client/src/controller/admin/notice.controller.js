import axios from "@utils/axios.js";
import { toast } from "@store/app.store.js";
import { useAppStore } from "@store/app.store.js";

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
