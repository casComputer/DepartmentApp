import axios from "@utils/axios";
import queryClient from "@utils/queryClient";

import {
    toast
} from "@store/app.store";

export const fetchParents = async page => {
    try {
        const {
            data
        } = await axios.post("/teacher/fetchParents", {
                page,
                limit: 25
            });

        if (data.success) return data;

        toast.error(
            "Failed to fetch parents",
            data.message ?? ""
        );

        return {
            parents: [],
            hasMore: false,
            nextPage: undefined,
            success: false
        };
    } catch (error) {
        toast.error("Failed to fetch parents!");

        return {
            parents: [],
            hasMore: false,
            nextPage: undefined,
            success: false
        };
    }
};

export const verifyParent = async (studentId, parentId) => {
    try {
        const {
            data
        } = await axios.post("/teacher/verifyParent", {
                parentId,
                studentId
            });

        if (data.success) {
            queryClient.setQueryData(["parents"], prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    pages: prev.pages.map(page => ({
                        ...page,
                        parents: page.parents.map(parent =>
                            parentId === parent.userId
                            ? {
                                ...parent,
                                students: parent.students.map(student =>
                                    student.studentId === studentId
                                    ? {
                                        ...student,
                                        isVerified: true
                                    }: student
                                )
                            }: parent
                        )
                    }))
                };
            });
        } else
            toast.error(
            "Failed to verify student for the parent",
            data.message ?? "",
        );
    } catch (error) {
        toast.error(
            "Failed to verify student for the parent!"
        );
    }
};
export const removeParent = async (studentId, parentId) => {
    try {
        const {
            data
        } = await axios.post("/teacher/removeParent", {
                parentId,
                studentId
            });

        if (data.success) {
            queryClient.setQueryData(["parents"], prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    pages: prev.pages.map(page => ({
                        ...page,
                        parents: page.parents.map(parent =>
                            parentId === parent.userId
                            ? {
                                ...parent,
                                students: parent.students.filter(
                                    student =>
                                    student.studentId !== studentId
                                )
                            }: parent
                        )
                    }))
                };
            });
        } else {
            toast.error(
                "Failed to reject parent request",
                data.message ?? "",
            );
        }
    } catch (error) {
        toast.error(
            "Failed to reject parent request!"
        );
    }
};