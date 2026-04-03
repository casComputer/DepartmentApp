import { turso } from "../../config/turso.js";
import Assignment from "../../models/assignment.js";

import {
    sendPushNotificationToClassStudents,
    sendNotificationForListOfUsers
} from "../../utils/notification.js";
import { deleteFilesBulk } from "../../utils/cloudinary.js";

export const createAssignment = async (req, res) => {
    try {
        const { topic, description, year, course, dueDate } = req.body;

        const { userId, role } = req.user;

        if (
            !topic ||
            !description ||
            !year ||
            !course ||
            !dueDate ||
            !userId ||
            !role
        ) {
            return res.json({
                message: "All fields are required",
                success: false
            });
        }

        const { rows } = await turso.execute(
            "SELECT COUNT(userId) as strength FROM students WHERE course = ? AND year = ? ",
            [course, year]
        );

        const newDoc = await Assignment.create({
            topic,
            description,
            year,
            course,
            dueDate,
            teacherId: userId,
            strength: rows[0]?.strength || 0
        });

        sendPushNotificationToClassStudents({
            course,
            year,
            title: "New Assignment Uploaded",
            body: "A new assignment has been added. Please review and submit before the deadline.",
            data: { type: "ASSIGNMENT_CREATION" }
        });

        res.status(200).json({
            message: "Assignment created successfully",
            success: true,
            assignment: newDoc
        });
    } catch (error) {
        console.error("Error creating assignment:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getAssignmentsCreatedByMe = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.body;
        const { userId: teacherId } = req.user;

        if (!teacherId) {
            return res.json({
                message: "teacherId is required",
                success: false
            });
        }

        const assignments = await Assignment.find({ teacherId })
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const hasMore = assignments.length === limit;
        const nextPage = hasMore ? page + 1 : null;

        res.status(200).json({ assignments, success: true, hasMore, nextPage });
    } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const reject = async (req, res) => {
    try {
        const { assignmentId, studentId, message } = req.body;

        if (!assignmentId || !studentId || !message) {
            return res.json({
                success: false,
                message: "missign required parameters!"
            });
        }

        await Assignment.updateOne(
            {
                _id: assignmentId,
                "submissions.studentId": studentId
            },
            {
                $set: {
                    "submissions.$.status": "rejected",
                    "submissions.$.rejectionMessage": message
                }
            }
        );

        sendNotificationForListOfUsers({
            title: "Assignment Needs Revision",
            body: "Your assignment was not approved. Please make the required changes and resubmit.",
            data: { type: "ASSIGNMENT_REJECTED" },
            users: [studentId]
        });

        res.status(200).json({
            message: "Assignment submission rejected successfully.",
            success: true
        });
    } catch (error) {
        console.error("Error rejecting assignment submission:", error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const accept = async (req, res) => {
    try {
        const { assignmentId, studentId } = req.body;

        await Assignment.updateOne(
            {
                _id: assignmentId,
                "submissions.studentId": studentId
            },
            {
                $set: {
                    "submissions.$.status": "accepted"
                }
            }
        );

        sendNotificationForListOfUsers({
            title: "Submission Approved 🎉",
            body: "Great work! Your assignment submission has been approved.",
            data: { type: "ASSIGNMENT_REJECTED" },
            users: [studentId]
        });

        res.status(200).json({
            message: "Assignment accepted successfully.",
            success: true
        });
    } catch (error) {
        console.error("Error accepting assignment submission:", error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const deleteAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.body;

        const assignment = await Assignment.findById(assignmentId);

        const ids = assignment?.submissions?.map(sub => sub.public_key);

        await deleteFilesBulk(ids);

        res.status(200).json({
            message: "Assignment accepted successfully.",
            success: true
        });
    } catch (error) {
        console.error("Error accepting assignment submission:", error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
