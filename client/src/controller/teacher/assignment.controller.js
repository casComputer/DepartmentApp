import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";

import { useAppStore } from "@store/app.store.js";
import queryClient from "@utils/queryClient";

export const createAssignment = async assignmentData => {
    try {
        const response = await axios.post("/assignment/create", assignmentData);

        if (response.data.success) {
            ToastAndroid.show(
                "Assignment created successfully",
                ToastAndroid.LONG
            );
            return response.data;
        }
    } catch (error) {
        ToastAndroid.show("Failed to create assignment", ToastAndroid.LONG);
        console.error("Error creating assignment:", error.message);
        throw error;
    }
};

export const getAssignment = async ({ pageParam }) => {
    try {
        const userId = useAppStore.getState().user.userId;
        const limit = 10;
        if (!userId) {
            throw new Error("User not logged in");
        }

        const response = await axios.post(
            "/assignment/getAssignmentsCreatedByMe",
            {
                teacherId: userId,
                page: pageParam,
                limit
            }
        );

        if (response.data.success) 
            return response.data;
        
        ToastAndroid.show(
            response.data?.message ?? "Failed to fetch assignment",
            ToastAndroid.LONG
        );
        return response.data;
    } catch (error) {
        ToastAndroid.show("Failed to fetch assignment", ToastAndroid.LONG);
        console.error("Error fetching assignment:", error.message);
        throw error;
    }
};

export const rejectAssignment = async (
    assignmentId,
    studentId,
    message = "No reason specified!",
    setAssignment
) => {
    try {
        const response = await axios.post("/assignment/reject", {
            assignmentId,
            studentId,
            message
        });

        if (response.data.success) {
            queryClient.setQueryData(["assignments"], prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    pages: prev.pages.map(page => ({
                        ...page,
                        assignments: page.assignments.map(assignment =>
                            assignment._id === assignmentId
                                ? {
                                      ...assignment,
                                      submissions: assignment.submissions.map(
                                          submission =>
                                              submission.studentId === studentId
                                                  ? {
                                                        ...submission,
                                                        status: "rejected"
                                                    }
                                                  : submission
                                      )
                                  }
                                : assignment
                        )
                    }))
                };
            });

            setAssignment(prev => ({
                ...prev,
                submissions: prev.submissions.map(submission =>
                    submission.studentId === studentId
                        ? {
                              ...submission,
                              status: "rejected"
                          }
                        : submission
                )
            }));

            ToastAndroid.show(
                "Assignment submission rejected successfully.",
                ToastAndroid.SHORT
            );
            return response.data;
        } else {
            ToastAndroid.show(response.data.message, ToastAndroid.LONG);
        }
    } catch (error) {
        ToastAndroid.show("Internal server error.", ToastAndroid.LONG);
        console.error("Error rejecting assignment submission:", error);
        throw error;
    }
};

export const acceptAssignment = async (
    assignmentId,
    studentId,
    setAssignment
) => {
    try {
        const response = await axios.post("/assignment/accept", {
            assignmentId,
            studentId
        });

        if (response.data.success) {
            setAssignment(prev => ({
                ...prev,
                submissions: prev.submissions.map(submission =>
                    submission.studentId === studentId
                        ? {
                              ...submission,
                              status: "accepted"
                          }
                        : submission
                )
            }));

            ToastAndroid.show(
                "Assignment submission accepted successfully.",
                ToastAndroid.SHORT
            );
            return;
        } else {
            ToastAndroid.show(response.data.message, ToastAndroid.LONG);
        }
    } catch (error) {
        ToastAndroid.show("Internal server error.", ToastAndroid.LONG);
        console.error("Error rejecting assignment submission:", error);
        throw error;
    }
};
