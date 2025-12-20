import express from "express";

import { turso } from "../config/turso.js";

const router = express.Router();

router.post("/create", async (req, res) => {
    try {
        const { role, userId, dueDate, details, year, course, amount } =
            req.body;

        if (
            !role ||
            !userId ||
            !dueDate ||
            !details ||
            !year ||
            !course ||
            !amount
        )
            return res.json({
                success: false,
                message: "missing required parameters!"
            });

        if (role === "teacher") {
            await turso.execute(
                `
                INSERT INTO fees 
                    (year, course, details, dueDate, teacherId, amount)
                    VALUES
                    (?, ?, ?, ?, ?, ?);
            `,
                [year, course, details, dueDate, userId, amount]
            );
        } else if (role === "admin") {
            await turso.execute(
                `
                INSERT INTO fees 
                    (year, course, details, dueDate, adminId, amount)
                    VALUES
                    (?, ?, ?, ?, ?, ?);
            `,
                [year, course, details, dueDate, userId, amount]
            );
        } else return res.json({ message: "invalid role", success: false });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
    }
});

router.post("/fetchByTeacher", async (req, res) => {
    try {
        const { role, userId } = req.body;

        if (!role || !userId)
            return res.json({
                success: false,
                message: "missing required parameters!"
            });

        let fees = null;

        if (role === "teacher") {
            const { rows } = await turso.execute(
                `
                SELECT * FROM fees WHERE teacherId = ?
            `,
                [userId]
            );
            fees = rows;
        } else if (role === "admin") {
            const { rows } = await turso.execute(
                `SELECT * FROM fees WHERE adminId = ?
            `[userId]
            );

            fees = rows;
        } else return res.json({ message: "invalid role", success: false });

        if (!fees)
            return res.json({
                success: false,
                message: "No fees history found for you!"
            });

        res.json({ success: true, fees });
    } catch (error) {
        console.error(error);
    }
});

export default router;
