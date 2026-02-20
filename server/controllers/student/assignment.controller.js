import Assignment from "../../models/assignment.js";
import { deleteFile } from "../../utils/cloudinary.js";
import { isDatePassed } from "../../utils/date.js";

export const getAssignmentForStudent = async (req, res) => {
    try {
        const { course, year, page = 1, limit = 10 } = req.body;

        if (!course || !year) {
            return res.json({
                message: "course and year are required",
                success: false
            });
        }

        const assignments = await Assignment.find({
            course,
            year
        })
            .sort({
                timestamp: -1
            })
            .skip((page - 1) * limit)
            .limit(limit);

        const hasMore = assignments.length === limit;
        const nextPage = hasMore ? page + 1 : null;

        res.status(200).json({
            assignments,
            success: true,
            hasMore,
            nextPage
        });
    } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const saveAssignmentSubmissionDetails = async (req, res) => {
    const { secure_url: url, format, assignmentId } = req.body;
    const { userId: studentId } = req.user;

    try {
        if (!assignmentId || !url || !format) {
            if (url) await deleteFile(url);

            return res.json({
                success: false,
                message: "Missing required fields"
            });
        }

        const existAssignment = await Assignment.findById(assignmentId);

        if (!existAssignment) {
            if (url) await deleteFile(url);

            return res.json({
                success: false,
                message: "Assignment not found!"
            });
        }

        const submittedDoc = existAssignment.submissions.find(
            submission =>
                submission.studentId.toString() === studentId.toString()
        );

        const isDeadlinePassed = isDatePassed(existAssignment.dueDate);

        if (submittedDoc && submittedDoc.status === "accepted") {
            await deleteFile(url);

            return res.json({
                success: false,
                message: "Assignment already accepted! Cannot resubmit."
            });
        }

        if (submittedDoc) {
            await Assignment.updateOne(
                {
                    _id: assignmentId,
                    "submissions.studentId": studentId
                },
                {
                    $set: {
                        "submissions.$.url": url,
                        "submissions.$.format": format,
                        "submissions.$.updatedAt": new Date(),
                        "submissions.$.status": "pending"
                    }
                }
            );

            return res.json({
                success: true,
                message: isDeadlinePassed
                    ? "Submission updated (Late)."
                    : "Submission updated."
            });
        }

        if (isDeadlinePassed) {
            await deleteFile(url);

            return res.json({
                success: false,
                message: "Assignment deadline exceeded."
            });
        }

        await Assignment.findByIdAndUpdate(assignmentId, {
            $push: {
                submissions: {
                    studentId,
                    url,
                    format,
                    submittedAt: new Date()
                }
            }
        });

        return res.json({
            success: true,
            message: "Assignment submitted successfully."
        });
    } catch (error) {
        if (url) await deleteFile(url);

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
