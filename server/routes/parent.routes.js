import express from "express";

import { turso } from "../config/turso.js";

const router = express.Router();

router.post("/fetchByClassTeacher", async (req, res) => {
    try {
        const { userId: teacherId } = req.user;

        const { rows } = turso.execute(
            `
            SELECT DISTINCT 
                u.userId,
                u.fullname,
                u.phone,
                u.is_verified
            FROM classes c
            JOIN students s
                ON s.course = c.course 
               AND s.year = c.year
            JOIN parent_child pc
                ON pc.studentId = s.userId
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

router.get("/sync", async (req, res) => {
    try {
        const { userId } = req.user;

        const { rows } = await turso.execute(
            `
              SELECT 
                  u.is_verified AS parent_verified,
                  pc.studentId
              FROM users u
              LEFT JOIN parent_child pc 
                  ON pc.parentId = u.userId 
                  AND pc.is_verified = 1
              WHERE u.userId = ?;
              `,
            [userId]
        );

        if (!rows?.length)
            return res.json({
                success: false,
                message: "User not found!",
                type: "NOT_FOUND"
            });

        const is_verified = rows[0]?.parent_verified;
        const students = rows.map(r => r.studentId).filter(Boolean);

        res.json({
            success: true,
            students,
            is_verified
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
