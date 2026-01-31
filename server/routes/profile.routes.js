import express from "express";

import { turso } from "../config/turso.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const tables = {
    student: { table: "students", id: "studentId" },
    teacher: { table: "teachers", id: "teacherId" },
    admin: { table: "admins", id: "adminId" },
    parent: { table: "parents", id: "parentId" }
};

router.post("/uploadDp", async (req, res) => {
    let { secure_url, public_id, current_dp_public_id } = req.body;
    const { role, userId } = req.user;

    if (!role || !userId || !secure_url || !public_id)
        return res.json({
            success: false,
            message: "Missing required parameters!"
        });

    try {
        if (!current_dp_public_id) {
            const { rows } = await turso.execute(
                `SELECT dp_public_id FROM users WHERE userId = ?`,
                [userId]
            );
            current_dp_public_id = rows[0]?.dp_public_id;
        }

        const query = `
            UPDATE users
            SET dp = ?, dp_public_id = ?
            WHERE userId = ?
        `;

        await turso.execute(query, [secure_url, public_id, userId]);

        if (current_dp_public_id)
            await cloudinary.api.delete_resources([current_dp_public_id], {
                resource_type: "image"
            });

        return res.json({
            success: true,
            message: "Profile picture updated successfully"
        });
    } catch (error) {
        console.error("uploadDp error:", error);

        await cloudinary.api.delete_resources([public_id], {
            resource_type: "image"
        });

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.post("/getDp", async (req, res) => {
    try {
        const { userId, role } = req.user;

        if (!userId || !role) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters!"
            });
        }

        const query = `
            SELECT dp, dp_public_id
            FROM users
            WHERE userId = ?
        `;

        const result = await turso.execute(query, [userId]);

        if (!result.rows || result.rows.length === 0) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const { dp, dp_public_id } = result.rows[0];

        return res.json({
            success: true,
            dp,
            dp_public_id
        });
    } catch (error) {
        console.error("Fetch dp Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.post("/editProfile", async (req, res) => {
    try {
        const { userId, role } = req.user;

        let { fullname, email, phone, about } = req.body;
        fullname = fullname?.trim();
        email = email?.trim();
        phone = phone?.trim();
        about = about?.trim();

        if (!fullname)
            return res.json({
                success: false,
                message: "Fullname cannot be empty"
            });

        const { rows: existUser } = await turso.execute(
            `SELECT * FROM users WHERE userId = ?`,
            [userId]
        );

        if (existUser.length === 0)
            return res.json({
                success: false,
                message: "User not found!"
            });

        const updateQuery = `
	  UPDATE users
	  SET fullname = ?, email = ?, phone = ?, about = ?
	  WHERE userId = ?
	`;
        await turso.execute(updateQuery, [
            fullname,
            email,
            phone,
            about,
            userId
        ]);

        return res.json({
            success: true,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.error("Edit Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default router;
