import express from "express";

import { turso } from "../config/turso.js";
import { validateCourseAndYear } from "../utils/validateCourseAndYear.js";
import { comparePassword, hashPassword } from "../utils/auth.utils.js";

const router = express.Router();

import signupController from "../controllers/auth/signup.controller.js";
import signinController from "../controllers/auth/signin.controller.js";
import { refreshAccessToken } from "../controllers/auth/refresh.controller.js";
import logoutController from "../controllers/auth/logout.controller.js";

import {
    authLimiter,
    adminLimiter,
    speedLimiter
} from "../middleware/ratelimit.middleware.js";

router.post("/signin", signinController);

router.post("/signup", signupController);

router.post("/refresh", refreshAccessToken);

router.post("/logout", logoutController);

// this allows parents to select thier childerns even before auth
router.post("/getStudentsForParents", async (req, res) => {
    try {
        const { course, year } = req.body;

        if (!validateCourseAndYear(course, year))
            return res
                .status(405)
                .json({ message: "invalid course or year", success: false });

        const result = await turso.execute(
            "SELECT u.userId, u.fullname from students s JOIN users u ON s.userId = u.userId where s.course = ? and s.year = ? and u.is_verified = 1",
            [course, year]
        );

        const students = result?.rows || [];

        res.json({
            students,
            numberOfStudents: students?.length || 0,
            success: true,
            course,
            year
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

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
                error: "Invalid password"
            });

        const hashedPassword = await hashPassword(newPassword);

        turso.execute(
            "UPDATE users SET password = ? WHERE userId = ? AND role = ?",
            [newPassword, userId, role]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("Error while changing password: ", err);
    }
});

export default router;
