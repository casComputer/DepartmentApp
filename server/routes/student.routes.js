import express from "express";

import { turso } from "../config/turso.js";
import { validateCourseAndYear } from "../utils/validateCourseAndYear.js";

const router = express.Router();

router.post("/fetchStudentsByClass", async (req, res) => {
    const { course, year } = req.body;

    try {
        if (!validateCourseAndYear(course, year))
            return res
                .status(405)
                .json({ message: "invalid course or year", success: false });

        const result = await turso.execute(
            "SELECT studentId, fullname from students where course = ? and year_of_study = ?",
            [course, year]
        );

        const students = result?.rows || [];

        res.json({
            students,
            numberOfStudents: students?.length || 0,
            success: true
        });
    } catch (err) {
        console.error("Error while fetching student details: ", err);
        res.status(500).json({
            error: "Error while fetching student details",
            success: false
        });
    }
});

router.post("/fetchStudentsByClassTeacher", async (req, res) => {
    const { teacherId } = req.body;

    try {
        const classResult = await turso.execute(
            `
            SELECT course, year 
            FROM class
            WHERE in_charge = ?
            `,
            [teacherId]
        );

        if (classResult.rows.length === 0) {
            return res.json({
                success: false,
                message: "Teacher is not assigned to any class!"
            });
        }

        const { course, year } = classResult.rows[0];

        const studentResult = await turso.execute(
            `
            SELECT studentId, fullname 
            FROM students
            WHERE course = ? AND year_of_study = ?
            `,
            [course, year]
        );

        if (studentResult.rows.length === 0) {
            return res.json({
                success: false,
                message: "Class has no students yet!",
                course,
                year
            });
        }

        return res.json({
            success: true,
            course,
            year,
            students: studentResult.rows
        });
    } catch (err) {
        console.error("Error while fetching student details:", err);
        res.status(500).json({
            success: false,
            error: "Server error while fetching student details"
        });
    }
});

export default router;
