import express from "express";

import { turso } from "../config/turso.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const tables = {
	student: { table: "students", id: "studentId" },
	teacher: { table: "teachers", id: "teacherId" },
	admin: { table: "admins", id: "adminId" },
	parent: { table: "parents", id: "parentId" },
};

router.post("/uploadDp", async (req, res) => {
	let { role, userId, secure_url, public_id, current_dp_public_id } = req.body;

	if (!role || !userId || !secure_url || !public_id)
		return res.json({
			success: false,
			message: "Missing required parameters!",
		});

	try {
		if (!tables[role])
			return res.json({
				success: false,
				message: "Invalid role!",
			});

		const { table, id } = tables[role];

		if (!current_dp_public_id) {
			const { rows } = await turso.execute(
				`SELECT dp_public_id FROM ${table} WHERE ${id} = ?`,
				[userId]
			);
			current_dp_public_id = rows[0]?.dp_public_id;
		}

		const query = `
            UPDATE ${table}
            SET dp = ?, dp_public_id = ?
            WHERE ${id} = ?
        `;

		await turso.execute(query, [secure_url, public_id, userId]);

		if (current_dp_public_id)
			await cloudinary.api.delete_resources([current_dp_public_id], {
				resource_type: "image",
			});

		return res.json({
			success: true,
			message: "Profile picture updated successfully",
		});
	} catch (error) {
		console.error("uploadDp error:", error);

		await cloudinary.api.delete_resources([public_id], {
			resource_type: "image",
		});

		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
});

router.post("/getDp", async (req, res) => {
	try {
		const { userId, role } = req.body;

		if (!userId || !role) {
			return res.status(400).json({
				success: false,
				message: "Missing required parameters!",
			});
		}

		if (!tables[role]) {
			return res.status(400).json({
				success: false,
				message: "Invalid role!",
			});
		}

		const { table, id } = tables[role];

		const query = `
            SELECT dp, dp_public_id
            FROM ${table}
            WHERE ${id} = ?
        `;

		const result = await turso.execute(query, [userId]);

		if (!result.rows || result.rows.length === 0) {
			return res.json({
				success: false,
				message: "User not found",
			});
		}

		const { dp, dp_public_id } = result.rows[0];

		return res.json({
			success: true,
			dp,
			dp_public_id,
		});
	} catch (error) {
		console.error("Fetch dp Error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
});

export default router;
