import express from "express";

import { turso } from "../config/turso.js";

import {
    cancelStudentVerification,
    fetchStudentsByClass,
    fetchStudentsByClassTeacher,
    saveStudentDetails,
    verifyStudent,
    verifyMultipleStudents
} from "../controllers/student/students.controller.js";

const router = express.Router();

router.post("/fetchStudentsByClass", fetchStudentsByClass);

router.post("/fetchStudentsByClassTeacher", fetchStudentsByClassTeacher);

router.post("/verifyStudent", verifyStudent);

router.post("/cancelStudentVerification", cancelStudentVerification);

router.post("/saveStudentDetails", saveStudentDetails);

router.post("/verifyMultipleStudents", verifyMultipleStudents);

router.post("/autoAssignRollNoAlphabetically", async (req, res) => {
    try {
        const { course, year } = req.body;

        if (!course || !year) {
            return res
                .status(400)
                .json({ error: "course and year are required" });
        }

        await turso.execute(
            `UPDATE students SET rollno = NULL WHERE course = ? AND year_of_study = ?`,
            [course, year]
        );

        // Fetch students sorted by name
        const { rows: students } = await turso.execute(
            `
	      SELECT studentId, fullname
	      FROM students
	      WHERE course = ? 
		AND year_of_study = ?
	      ORDER BY fullname ASC
	      `,
            [course, year]
        );

        // Assign roll numbers
        let rollno = 1,
            updated = [];

        for (const s of students) {
            await turso.execute(
                `
        UPDATE students
        SET rollno = ?
        WHERE studentId = ?
        `,
                [rollno, s.studentId]
            );

            updated.push({ ...s, rollno });

            rollno++;
        }

        res.json({ success: true, students: updated });
    } catch (err) {
        console.log("Error while assigning roll numbers:", err);
        res.status(500).json({ error: "Internal error", success: false });
    }
});

export default router;
