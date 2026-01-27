import ExamResult from "../../models/examResult.js";
import cloudinary from "../../config/cloudinary.js";

const deleteFile = async (public_id)=> {
    try {
        await cloudinary.api.delete_resources([public_id], {
            resource_type: "raw",
        });
    } catch(e) {
        console.error('Error while deleting file: ', e)
    }
}

export const saveExamResultDetails = async (req, res) => {
    const {
        userId: studentId,
        role
    } = req.user || {};

    const {
        filename,
        format,
        course,
        sem,
        secure_url,
        public_id
    } =
    req.body?.data || {};

    try {
        if (role !== "student") {
            await deleteFile(public_id)
            return res.json({
                success: false,
                message: "You have no access to upload exam results!",
            });
        }

        // File validation
        if (!filename || !format || !secure_url || !public_id) {
            await deleteFile(public_id)
            return res.json({
                success: false,
                message: "File uploaded details are missing!",
            });
        }

        // Class info validation
        if (!course || !sem) {
            await deleteFile(public_id)
            return res.json({
                success: false,
                message: "Missing your class information!",
            });
        }

        // Check if result already exists
        const existingResult = await ExamResult.findOne({
            course,
            sem,
            studentId,
        });

        if (existingResult) {
            await deleteFile(public_id)

            return res.json({
                success: false,
                message: "You already uploaded result for this semester!",
            });
        }

        // Save new result
        await ExamResult.create({
            course,
            sem,
            secure_url,
            format,
            studentId,
            filename,
        });

        return res.status(200).json({
            success: true,
        });
    } catch (err) {
        if (public_id)
            await deleteFile(public_id)

        console.log("Error while saving exam result:", err);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const checkExamResultUpload = async (req, res) => {
    const {
        userId: studentId,
        role
    } = req.user;

    const {
        course,
        sem
    } = req.body;

    try {
        if (role !== "student")
            return res.json({
            success: false,
            message: "You have no access to check exam results!",
        });

        if (!course || !sem)
            return res.json({
            success: false,
            message: "Missing your class informations!",
        });

        const existDoc = await ExamResult.find({
            course,
            sem,
            studentId,
        });

        if (existDoc && existDoc.length > 0) {
            return res.json({
                success: true,
                uploaded: true,
            });
        }
        res.json({
            success: true, uploaded: false
        });
    } catch (err) {
        console.error("Error while checking exam result upload: ", err);
        res.status(500).json({
            success: false, uploaded: false
        });
    }
};