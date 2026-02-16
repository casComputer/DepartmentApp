import Internal from "../../models/internalMark.js";

import { deleteFile } from "../../utils/cloudinary.js";

export const saveInternalMarkDetails = async (req, res) => {
    const { course, sem, filename, secure_url, format, public_id } =
        req.body.data;
    try {
        const { userId: teacherId, role } = req.user;

        if (role !== "teacher" && role !== "admin") {
            await deleteFile(public_id);
            return res.json({
                success: false,
                message: "UnAutherized access!"
            });
        }

        if (
            !course ||
            !sem ||
            !filename ||
            !secure_url ||
            !format ||
            !public_id
        ) {
            if (public_id) await deleteFile(public_id);
            return res.json({
                success: false,
                message: "Missing some required fields!"
            });
        }

        const existDoc = await Internal.findOne({
            teacherId,
            course,
            sem
        });

        if (existDoc) {
            await deleteFile(public_id);
            return res.json({
                success: false,
                message: "Internal mark already uploaded for this sem!"
            });
        }

        await Internal.create({
            course,
            sem,
            filename,
            secure_url,
            format,
            teacherId
        });

        res.json({
            success: true
        });
    } catch (e) {
        if (public_id) await deleteFile(public_id);
        console.error("Error while saving internal mark details: ", e);
        res.json({
            success: false,
            message: "Server Error!"
        });
    }
};

export const checkInternalMarkUpload = async (req, res) => {
    try {
        const { course, sem } = req.body;

        const { userId: teacherId, role } = req.body;

        if (!course || !sem)
            return res.json({
                success: false,
                message: "Missing some required fields!"
            });

        const existDoc = await Internal.findOne({
            course,
            sem,
            teacherId
        });

      
        res.json({
            success: true,
            uploaded: existDoc ? true : false
        });
    } catch (e) {
        console.error("Error while checking internal mark uploads: ", e);
        res.json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getInternalMarkHistory = async (req, res) => {
    try {
        const { userId: teacherId } = req.user;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const [internals, total] = await Promise.all([
            Internal.find({ teacherId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Internal.countDocuments({ teacherId })
        ]);

        const hasMore = skip + internals.length < total;

        res.json({
            success: true,
            internals,
            hasMore,
            nextPage: hasMore ? parseInt(page) + 1 : null
        });
    } catch (e) {
        console.error("Error while fetching internal mark history: ", e);
        res.json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
