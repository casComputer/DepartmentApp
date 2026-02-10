import Notification from "../../models/notification.js";
import { turso } from "../../config/turso.js";

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

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const notifications = await Notification.find({
            $or: [
                { target: { $in: ["all", role] } },
                {
                    target: "class",
                    yearCourse: `${year}-${course}`
                },
                { userIds: { $in: [userId] } }
            ]
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean();

        const hasMore = notifications.length === limitNum;

        res.json({
            success: true,
            hasMore,
            nextPage: hasMore ? pageNum + 1 : null,
            notifications
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
