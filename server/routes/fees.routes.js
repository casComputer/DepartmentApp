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

export default router;
