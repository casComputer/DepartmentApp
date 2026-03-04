import express from "express";

import {
    addNotificationToken,
    getUserNotifications
} from "../controllers/users/notification.controller.js";
import { turso } from "../config/turso.js";
import { comparePassword, hashPassword } from "../utils/auth.utils.js";

const router = express.Router();

router.post("/addNotificationToken", addNotificationToken);

router.post("/getUserNotifications", getUserNotifications);

router.post("/changePassword", async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const { userId, role } = req.user;

        const { rows: user } = await turso.execute(
            "SELECT password FROM users WHERE userId = ? AND role = ?",
            [userId, role]
        );

        const validPassword = await comparePassword(
            currentPassword,
            user[0].password
        );

        if (!validPassword)
            return res.json({
                success: false,
                message: "Invalid current password"
            });

        const hashedPassword = await hashPassword(newPassword);

        turso.execute(
            "UPDATE users SET password = ? WHERE userId = ? AND role = ?",
            [hashedPassword, userId, role]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("Error while changing password: ", err);
    }
});

export default router;
