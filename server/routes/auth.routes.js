import express from "express";
import { turso } from "../config/turso.js";
import { validateCourseAndYear } from "../utils/validateCourseAndYear.js";

const router = express.Router();

import signupController from "../controllers/auth/signup.controller.js";
import signinController from "../controllers/auth/signin.controller.js";
import { refreshAccessToken } from "../controllers/auth/refresh.controller.js";
import logoutController from "../controllers/auth/logout.controller.js";

import {
    authLimiter,
    adminLimiter,
    uploadLimiter,
    speedLimiter
} from "../middleware/ratelimit.middleware.js";

router.post("/signin", authLimiter, signinController);

router.post("/signup", authLimiter, signupController);

router.post("/refresh", speedLimiter, refreshAccessToken);

router.post("/logout", logoutController);

router.post("/getStudentsForParents", speedLimiter, async (req, res) => {
    try {
        const { course, year } = req.body;

        if (!validateCourseAndYear(course, year))
            return res
                .status(405)
                .json({ message: "invalid course or year", success: false });

        const result = await turso.execute(
            "SELECT u.userId, u.fullname from students s JOIN users u ON s.userId = u.userId where s.course = ? and s.year = ? and u.is_verified = 1",
            [course, year],
        );

        const students = result?.rows || [];
        console.log(students);

        res.json({
            students,
            numberOfStudents: students?.length || 0,
            success: true,
            course,
            year,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});


export default router;
