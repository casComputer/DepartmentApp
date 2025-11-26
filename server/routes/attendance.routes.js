import express, { json } from "express";
import { turso } from "../config/turso.js";

const router = express.Router();

router.post("/save", async (req, res) => {
	try {
		const { attendance, course, year, teacherId } = req.body;

		const timestamp = new Date().toISOString();

		const present = attendance.filter((record) => record.present);
		const absent = attendance.filter((record) => !record.present);

		const insertQuery = `
				INSERT INTO attendance (course, year, present, absent, date, teacherId)
				VALUES (?, ?, ?, ?, ?, ?)
			`;

		turso.execute(insertQuery, [
			course,
			year,
			JSON.stringify(present),
			JSON.stringify(absent),
			timestamp,
			teacherId,
		]);

		res.status(200).json({
			message: "Attendance saved successfully",
			success: true,
		});
	} catch (err) {
		console.log("Error while saving attendence: ", err);
		res.status(500).json({
			message: "Internal server error",
			success: false,
		});
	}
});

router.post("/getAttandanceTakenByTeacher", async (req, res) => {
	try {
		const { teacherId, page = 1, limit = 10 } = req.body;
		const offset = (page - 1) * limit;

		const { rows } = await turso.execute(
			"SELECT * FROM attendance WHERE teacherId = ? ORDER BY date DESC LIMIT ? OFFSET ?",
			[teacherId, limit, offset]
		);

		let attendance = rows.map((item) => {
			return {
				...item,
				present: JSON.parse(item.present || "[]"),
				absent: JSON.parse(item.absent || "[]"),
				late_present: JSON.parse(item.late_present || "[]"),
			};
		});

		const totalCountResult = await turso.execute(
			"SELECT COUNT(*) as count FROM attendance WHERE teacherId = ?",
			[teacherId]
		);
		const totalCount = totalCountResult.rows[0].count;

		const hasMore = page * limit < totalCount;

		res.json({
			success: true,
			attendance,
			nextPage: hasMore ? page + 1 : null,
			hasMore,
		});
	} catch (err) {
		console.log("Error while fetching attendence: ", err);
		res.status(500).json({
			message: "Internal server error",
			success: false,
		});
	}
});

export default router;
