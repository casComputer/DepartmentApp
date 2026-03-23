import axios from "@utils/axios.js";

import {
    useAppStore,
    toast
} from "@store/app.store.js";
import queryClient from "@utils/queryClient";

export const createAssignment = async assignmentData => {
    try {
        const response = await axios.post("/assignment/create", assignmentData);

        if (response.data.success) {
            toast.success(
                "Assignment created successfully"
            );

            queryClient.setQueryData(["assignments"], prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    pages: prev.pages.map(page => ({
                        ...page,
                        assignments: [
                            response.data.assignment,
                            ...page.assignments
                        ]
                    }))
                };
            });

            return response.data;
        }
        toast.error("Failed to create assignment");
    } catch (error) {
        toast.error("Failed to create assignment");

    }
};

export const getAssignment = async ({
    pageParam
}) => {
    try {
        const response = await axios.post(
            "/assignment/getAssignmentsCreatedByMe",
            {
                page: pageParam,
                limit: 15
            }
        );

        if (response.data.success) return response.data;

        toast.error(
            "Failed to fetch assignment",
            response.data?.message ?? ""
        );
        return response.data;
    } catch (error) {
        toast.error("Failed to fetch assignment");
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
                                    }: submission
                                )
                            }: assignment
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
                    }: submission
                )
            }));

            toast.success(
                "Assignment rejection successfull"
            );
            return response.data;
        } else {
            toast.error("Failed to reject Assignment", response.data.message ?? "");
        }
    } catch (error) {
        toast.error("Failed to reject Assignment");
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
                                        status: "accepted"
                                    }: submission
                                )
                            }: assignment
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
                        status: "accepted"
                    }: submission
                )
            }));

            toast.success(
                "Assignment submission accepted successfully."
            );
            return;
        } else {
            toast.error("Failed to accept Assignment", response.data.message ?? "");
        }
    } catch (error) {
        toast.error("Failed to accept Assignment");

    }
};