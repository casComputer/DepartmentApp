import express from "express";

import { turso } from "../config/turso.js";
import { validateCourseAndYear } from "../utils/validateCourseAndYear.js";

import { fetchStudentsByClass, fetchStudentsByClassTeacher } from "../controllers/student/students.controller.js"

const router = express.Router();

router.post("/fetchStudentsByClass", fetchStudentsByClass);

router.post("/fetchStudentsByClassTeacher", fetchStudentsByClassTeacher);

router.post('/verifyStudent', async (req, res) => {
    const { studentId } = req.body;

    try {
        await turso.execute(
            'UPDATE students SET is_verified = true WHERE studentId = ?',
            [studentId]
        );

        res.json({ success: true, message: "Student verified" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

export default router;
