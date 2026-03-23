import {
    router
} from "expo-router";

import axios from "@utils/axios.js";
import {
    toast
} from "@store/app.store";

export const handleSave = async data => {
    try {
        const res = await axios.post("/teacher/saveInternalMarkDetails", {
            data
        });

        if (res.data.success) {
            toast.success(
                "Internal mark uploaded successfull"
            )
            router.back();
        } else
            toast.error(
            "Failed to upload internal mark",
            res.data.message ?? ""
        );
    } catch (e) {
        toast.error("Failed to upload internal mark!");
    }
};

export const checkExists = async (course, sem) => {
    try {
        const res = await axios.post("/teacher/checkInternalMarkUpload", {
            course,
            sem
        });

        if (res.data.success) {
            if (res.data?.uploaded) {
                toast.error(
                    "You already uploaded internal marks for this sem!"
                );
            }

            return {
                uploaded: res.data.uploaded,
                failed: false
            };
        }

        toast.error(
            "Failed to check existing internal marks",
            res.data.message ?? "",

        );
        return {
            uploaded: false,
            failed: true
        };
    } catch (e) {
        toast.error(
            "Failed to check existing internal marks"
        );
        return {
            uploaded: false,
            failed: true
        };
    }
};

export const getHistory = async page => {
    try {
        const res = await axios.post("/teacher/getInternalMarkHistory", {
            page,
            limit: 15
        });

        if (res.data.success) {
            return res.data;
        } else {
            toast.error(
                "Failed to fetch history",
                res.data.message ?? ""
            );
            return {
                data: [],
                hasMore: false,
                nextPage: null
            };
        }
    } catch (e) {
        toast.error("Failed to fetch history!");
        return {
            data: [],
            hasMore: false,
            nextPage: null
        };
    }
};