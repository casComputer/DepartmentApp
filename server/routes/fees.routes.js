import express from "express";

import { turso } from "../config/turso.js";

const router = express.Router();

router.post("/create", async (req, res) => {
    try {
        const { role, userId, dueDate, details, year, course } = req.body;

        if (!role || !userId || !dueDate || !details || !year || !course)
            return res.json({
                success: false,
                message: "missing required parameters!"
            });

        if (role === "teacher") {
            await turso.execute(
                `
                INSERT INTO fees 
                    (year, course, details, dueDate, teacherId)
                    VALUES
                    (?, ?, ?, ?, ?);
            `,
                [year, course, details, dueDate, userId]
            );
        } else if (role === "admin") {
            await turso.execute(
                `
                INSERT INTO fees 
                    (year, course, details, dueDate, adminId)
                    VALUES
                    (?, ?, ?, ?, ?);
            `,
                [year, course, details, dueDate, userId]
            );
        } else return res.json({ message: "invalid role", success: false });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
    }
});

export default router;
