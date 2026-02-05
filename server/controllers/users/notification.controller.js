import Notification from "../../models/notification.js";
import { turso } from "../config/turso.js";

export const addNotificationToken = async (req, res) => {
    try {
        const { token = "" } = req.body;
        const { userId, role } = req.user;

        await turso.execute(
            `
            UPDATE users SET token = ? WHERE userId = ? AND role = ?
        `,
            [token, userId, role]
        );

        res.json({
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserNotifications = async (req, res) => {
    try {
        const { course = "", year = "", page = 1, limit = 10 } = req.body;
        const { userId, role } = req.user;

        const skip = (page - 1) * limit;

        const notifications = await Notification.find({
            $or: [
                { target: { $in: ["all", role] } },
                {
                    target: "class",
                    yearCourse: `${year}-${course}`
                },
                { userIds: userId }
            ]
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        res.json({
            success: true,
            hasMore: notifications.length === limit,
            nextPage: hasMore ? page + 1 : null,
            notifications
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
