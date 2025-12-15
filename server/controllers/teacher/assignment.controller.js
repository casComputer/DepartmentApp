import { turso } from "../../config/turso.js";
import Assignment from "../../models/assignment.js";

export const createAssignment = async (req, res) => {
    try {
        const { topic, description, year, course, dueDate, teacherId } =
            req.body;

        if (
            !topic ||
            !description ||
            !year ||
            !course ||
            !dueDate ||
            !teacherId
        ) {
            return res.json({
                message: "All fields are required",
                success: false
            });
        }

        const { rows } = await turso.execute(
            "SELECT strength FROM classes WHERE course = ? AND year = ? ",
            [course, year]
        );

        const newDoc = await Assignment.create({
            topic,
            description,
            year,
            course,
            dueDate,
            teacherId,
            strength: rows[0]?.strength || 0
        });

        res.status(200).json({
            message: "Assignment created successfully",
            success: true,
            assignment :newDoc
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
        const { teacherId, page = 1, limit = 10 } = req.body;

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

        if(!assignmentId || !studentId || !message){
            return res.json({ success: false, message: 'missign required parameters!'})
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
}

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
}