import express from "express";

import { turso } from "../config/turso.js";

const router = express.Router();

router.post("/fetchByClassTeacher", async (req, res) => {
    try {
        const { userId: teacherId } = req.user;

        console.log("fetch parents by: ",teacherId)

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

export default router;
