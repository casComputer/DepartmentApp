import express from "express";

import { turso } from "../config/turso.js";

const router = express.Router();

router.post("/fetchByClassTeacher", async (req, res) => {
    try {
        const { userId: teacherId } = req.user;

        const { rows } = turso.execute(
            `
            SELECT DISTINCT 
                p.parentId,
                p.fullname,
                p.phone,
                p.is_verified
            FROM classes c
            JOIN students s
                ON s.course = c.course 
               AND s.year = c.year
            JOIN parent_child pc
                ON pc.studentId = s.studentId
            JOIN users u
                ON u.userId = pc.parentId
            WHERE c.in_charge = ?;
        `,
            [teacherId]
        );

        res.json({
            success: true,
            parents: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
});

export default router;
