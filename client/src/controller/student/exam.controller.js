import axios from "@utils/axios.js";

import {
    useAppStore,
    toast
} from "@store/app.store.js";

export const handleSaveResultDetails = async data => {
    try {
        const course = useAppStore.getState().user.course;
        data.course = course;
        const res = await axios.post("/student/saveExamResultDetails", {
            data
        });

        if (res.data.success)
            toast.success(
            "Exam result uploaded successfull ✨",
        );
        else
            toast.error(
            "Failed to upload exam result!",
            res.data.message ?? ""
        );
    } catch (e) {
        toast.error("Failed to upload exam result!");
    }
};

export const checkExamResultUpload = async sem => {
    try {
        const course = useAppStore.getState().user.course;

        const res = await axios.post("/student/checkExamResultUpload", {
            course,
            sem
        });

        if (res.data.success) return res.data.uploaded;

        toast.error(
            "Failed to check exam existing results",
            res.data.message ?? ""
        );
        return false;
    } catch (e) {
        toast.error(
            "Failed to check exam result upload",
        );
        return false;
    }
};