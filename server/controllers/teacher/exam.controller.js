import Exam from "../../models/examResult.js"

export const fetchExamResult = async (req, res) => {
    try {
        const { course, sem } = req.body;

        if (!course || !sem) {
            return res.json({
                success: false,
                message: "Missing required parameters",
            });
        }

        const results = await Exam.find({ course, sem });

        return res.json({ success: true, results });
    } catch (error) {
        console.error("Error fetching exam results:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
};
