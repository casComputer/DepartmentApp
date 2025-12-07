import Assignment from "../../models/assignment.js";

export const getAssignmentForStudent = async (req, res) => {
    try {
        const {
            course,
            year_of_study,
            studentId,
            page = 1,
            limit = 10
        } = req.body;

        if (!course || !year_of_study || !studentId) {
            return res.json({
                message: "course, year_of_study and studentId are required",
                success: false
            });
        }

        const assignments = await Assignment.find({
            course,
            year: year_of_study
        })
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

export const saveAssignmentSubmissionDetails = async (req, res) => {
    const { studentId, secure_url: url, format, assignmentId } = req.body;

    try {
        if (!studentId || !assignmentId || !url || !format) {
            return res.json({
                message: "Missing required fields",
                success: false
            });
        }
        
        const existAssignment = await Assignment.findById(assignmentId)
        
        if(!existAssignment) return res.json({
            success: false, message: 'Assignment not found!'
        })
        
        const isSubmitted = existAssignment?.submissions.some(submission => submission.studentId === studentId);

        if(isSubmitted) return res.json({
            success: false, message: 'Assignment already submitted!'
        })
        
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

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
