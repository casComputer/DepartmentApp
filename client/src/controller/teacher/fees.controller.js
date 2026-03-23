import axios from "@utils/axios.js";
import queryClient from "@utils/queryClient.js";

import {
    useAppStore,
    toast
} from "@store/app.store.js";

export const create = async ({
    course, year, details, amount, dueDate
}) => {
    try {
        if (!course || !year || !details || !amount || !dueDate) {
            toast.warn("Missing required values!");
            return false;
        }

        const res = await axios.post("/fees/create", {
            course,
            year,
            details,
            amount,
            dueDate
        });

        if (res.data.success) {
            toast.success(
                "Fees Details Updated Successfully"
            );
            return true;
        } else {
            toast.error(
                "Failed to update fee details",
                res.data.message ?? ""
            );
            return false;
        }
    } catch (error) {
        toast.error("Failed to update fee details");
        return false;
    }
};

export const fetch = async page => {
    try {
        const res = await axios.post("/fees/fetchByTeacher", {
            page,
            limit: 15
        });

        if (res.data.success) {
            return res.data;
        } else {
            toast.error(
                "Failed to fetch fee details",
                res.data.message ?? "",
            );

            return {
                success: false,
                hasMore: true,
                page,
                fees: []
            };
        }
    } catch (error) {
        toast.error("Failed to fetch fee details");
        return {
            success: false,
            hasMore: true,
            page,
            fees: []
        };
    }
};

export const deleteFee = async feeId => {
    try {
        queryClient.setQueryData(["fees"], oldData => {
            if (!oldData) return oldData;

            return {
                ...oldData,
                pages: oldData.pages.map(page => ({
                    ...page,
                    fees: page?.fees?.filter(fee => fee?.feeId !== feeId)
                }))
            };
        });

        const {
            data
        } = await axios.post("/fees/delete",
            {
                feeId
            });

        if (!data.success) {
            toast.error(
                "Failed to delete fee item",
                data?.message ?? ""
            );
        }
    } catch (error) {
        toast.error("Failed to delete fee item");
    }
};