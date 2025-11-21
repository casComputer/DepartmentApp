import express from "express";

import { turso } from "../config/turso.js";
import { validateCourseAndYear } from "../utils/validateCourseAndYear.js";

const router = express.Router();

router.get("/getAllStudents", async (req, res) => {
    try {
        const result = await turso.execute(
            "SELECT studentId, fullname from students "
        );

        res.send(result);
    } catch (err) {
        console.error("Error while fetching student details: ", err);
        res.status(500).json({
            error: "Error while fetching student details",
            success: false
        });
    }
});

router.post("/getStudents", async (req, res) => {
    const { course, year } = req.body;

    if (!validateCourseAndYear(course, year))
        return res
            .status(405)
            .json({ message: "invalid course or year", success: false });

    try {
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

export default router;
