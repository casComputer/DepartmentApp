import ExamResult from "../../models/examResult.js"
import cloudinary from "../../config/cloudinary.js";

export const saveExamResultDetails = async(req, res)=> {
    const {
        userId: studentId,
        role
    } = req.user
    const {
        filename,
        format,
        course,
        year,
        sem,
        secure_url,
        public_id
    } = req.body
    try {
        if (role !== 'student') return res.json({
            success: false, message: 'You have no access to upload exam results!'
        })

        if (!filename || !format || !secure_url || !public_id) return res.json({
            success: false, message: 'File uploaded details are missing!'
        })

        if (!course || !year || !sem) return res.json({
            success: false, message: 'Missing your class informations!'
        })

        const existDoc = await ExamResult.find({
            course, year, sem, studentId
        })

        if (existDoc) {
            await cloudinary.api.delete_resources([public_id], {
                resource_type: "auto",
            });
            return res.json({
                success: false, message: 'You already uploaded result for this sem!'
            })
        }

        await ExamResult.create({
            course, year, sem, secure_url, format, studentId, filename
        })
        
        res.json({ success: true })

    } catch(err) {
        await cloudinary.api.delete_resources([public_id], {
            resource_type: "auto",
        });
        console.error("Error while saving exam result: ", err)
    }
}