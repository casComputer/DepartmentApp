import Notice from "../../models/notice.js";
import { deleteFile } from "../../utils/cloudinary.js";
import { validateCourseAndYear } from "../../utils/validateCourseAndYear.js";
import {
    sendPushNotificationToAllUsers,
    sendPushNotificationToClassStudents,
    sendPushNotificationToClassParents
} from "../../utils/notification.js";

export const createNotice = async (req, res) => {
    try {
        const { title, description, image, imagePublicId, target, year, course } =
            req.body;
        const { userId } = req.user;

        if (!title || !target) {
            if (imagePublicId) await deleteFile(imagePublicId);
            return res.json({ success: false, message: "Title and target are required." });
        }

        const validTargets = ["all", "teacher", "student", "parent", "class"];
        if (!validTargets.includes(target)) {
            if (imagePublicId) await deleteFile(imagePublicId);
            return res.json({ success: false, message: "Invalid target audience." });
        }

        let yearCourse = null;

        if (target === "class") {
            if (!validateCourseAndYear(course, year)) {
                if (imagePublicId) await deleteFile(imagePublicId);
                return res.json({ success: false, message: "Invalid course or year for class target." });
            }
            yearCourse = `${year}-${course}`;
        }

        const notice = await Notice.create({
            title,
            description,
            image: image ?? null,
            imagePublicId: imagePublicId ?? null,
            target,
            yearCourse,
            createdBy: userId
        });

        // Fire push notifications based on target
        const notifData = {
            type: "NOTICE",
            noticeId: notice._id.toString()
        };

        if (target === "all") {
            await sendPushNotificationToAllUsers(
                title,
                description ?? "",
                notifData,
                null // all roles
            );
        } else if (target === "teacher" || target === "student" || target === "parent") {
            await sendPushNotificationToAllUsers(
                title,
                description ?? "",
                notifData,
                target
            );
        } else if (target === "class") {
            await sendPushNotificationToClassStudents({
                course,
                year,
                title,
                body: description ?? "",
                data: notifData,
                image: image ?? null
            });
            await sendPushNotificationToClassParents({
                course,
                year,
                title,
                body: description ?? "",
                data: notifData,
                image: image ?? null
            });
        }

        res.json({ success: true, notice });
    } catch (error) {
        console.error("Error creating notice:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteNotice = async (req, res) => {
    try {
        const { noticeId } = req.body;

        if (!noticeId)
            return res.json({ success: false, message: "Notice ID is required." });

        const notice = await Notice.findByIdAndDelete(noticeId);

        if (!notice)
            return res.json({ success: false, message: "Notice not found." });

        if (notice.imagePublicId) {
            await deleteFile(notice.imagePublicId);
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting notice:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getAdminNotices = async (req, res) => {
    try {
        const { page = 1, limit = 15 } = req.body;

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const notices = await Notice.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean();

        const hasMore = notices.length === limitNum;

        res.json({
            success: true,
            notices,
            hasMore,
            nextPage: hasMore ? pageNum + 1 : null
        });
    } catch (error) {
        console.error("Error fetching admin notices:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
