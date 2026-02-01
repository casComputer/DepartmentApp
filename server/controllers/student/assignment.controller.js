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
                message: "Missing required fields",
                success: false
            });
        }

        const existAssignment = await Assignment.findById(assignmentId);

        if (!existAssignment) {
            await deleteFile();
            return res.json({
                success: false,
                message: "Assignment not found!"
            });
        }

        const isSubmitted = existAssignment?.submissions.some(
            submission => submission.studentId === studentId
        );

        if (isSubmitted) {
            await deleteFile();

            return res.json({
                success: false,
                message: "Assignment already submitted!"
            });
        }
        
        if(isDatePassed(existAssignment.dueDate)){
            await deleteFile();

            return res.json({
                success: false,
                message: "Assignment deadline exceeded."
            });
        }

        const submission = {
            studentId,
            url,
            format
        };

        await Assignment.findByIdAndUpdate(assignmentId, {
            $push: {
                submissions: submission
            }
        });

        res.json({
            success: true
        });
    } catch (error) {
        await deleteFile();
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
