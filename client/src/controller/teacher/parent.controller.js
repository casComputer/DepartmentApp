import axios from "@utils/axios";
import queryClient from "@utils/queryClient";

import { ToastAndroid } from "react-native";

export const fetchParents = async page => {
    try {
        const { data } = await axios.post("/teacher/fetchParents", {
            page,
            limit: 25
        });

        if (data.success) return data;

        ToastAndroid.show(
            data.message ?? "Failed to fetch parents!",
            ToastAndroid.LONG
        );
        return {
            parents: [],
            hasMore: false,
            nextPage: undefined,
            success: false
        };
    } catch (error) {
        console.error(error);
        ToastAndroid.show("Failed to fetch parents!", ToastAndroid.LONG);
        return {
            data: [],
            hasMore: false,
            nextPage: undefined,
            success: false
        };
    }
};

export const verifyParent = async (studentId, parentId) => {
    try {
        const { data } = await axios.post("/teacher/verifyParent", {
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
                                                    ...studentId,
                                                    isVerified: true
                                                }
                                              : student
                                      )
                                  }
                                : parent
                        )
                    }))
                };
            });
            ToastAndroid.show("verified", ToastAndroid.LONG);
        } else
            ToastAndroid.show(
                data.message ?? "Failed to varify parent!",
                ToastAndroid.LONG
            );
    } catch (error) {
        ToastAndroid.show("Failed to verify parent!", ToastAndroid.LONG);
        console.error(error);
    }
};
export const removeParent = async (studentId, parentId) => {
    try {
        const { data } = await axios.post("/teacher/removeParent", {
            parentId,
            studentId
        });

        if (data.message) return;
        ToastAndroid.show(
            data.message ?? "Failed to remove parent!",
            ToastAndroid.LONG
        );
    } catch (error) {
        ToastAndroid.show("Failed to remove parent!", ToastAndroid.LONG);
        console.error(error);
    }
};
