import express from "express";
import { turso } from "../config/turso.js";

const router = express.Router();

router.post("/getStudents", async (req, res) => {
    const { course, year } = req.body;

    try {
        const result = await turso.execute(
            "SELECT studentId, fullname from students where course = ? and year_of_study = ?",
            [course, year]
        );

        const students = result.rows;

        res.json({
            students,
            numberOfStudents: students.length,
            success: false
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
