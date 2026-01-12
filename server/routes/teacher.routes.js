import express from "express";

import { turso } from "../config/turso.js";

const router = express.Router();

router.post("/saveWorklog", async (req, res) => {
	try {
		const { year, course, date, hour, subject, topics, teacherId } = req.body;

<<<<<<< HEAD
        if (
            !year ||
            !course ||
            !date ||
            !hour ||
            !subject ||
            !topics ||
            topics.length === 0 ||
            !teacherId
        ) {
            return res.status(400).json({
                message: "All fields are required to save the worklog.",
                success: false,
            });
        }
=======
		if (
			!year ||
			!course ||
			!date ||
			!hour ||
			!subject ||
			!topics ||
			topics.length === 0 ||
			!teacherId
		) {
			return res.status(400).json({
				message: "All fields are required to save the worklog.",
				success: false,
			});
		}
>>>>>>> 9fc9ae3eeb73f2c346785576142fcfc3ce825101

		await turso.execute(
			`
        INSERT INTO worklogs (year, course, date, hour, subject, topics, teacherId)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
			[year, course, date, hour, subject, topics, teacherId]
		);

<<<<<<< HEAD
        return res
            .status(200)
            .json({ message: "Worklog saved successfully.", success: true });
    } catch (error) {
        // check sql uniwue constraint error
        if (error.message.includes("UNIQUE constraint failed")) {
            return res.status(400).json({
                message: "Worklog for the given date and hour already exists.",
                success: false,
            });
        }
        console.error("Error saving worklog:", error);
=======
		return res
			.status(200)
			.json({ message: "Worklog saved successfully.", success: true });
	} catch (error) {
		// check sql uniwue constraint error
		if (error.message.includes("UNIQUE constraint failed")) {
			return res.status(400).json({
				message: "Worklog for the given date and hour already exists.",
				success: false,
			});
		}
		console.error("Error saving worklog:", error);
>>>>>>> 9fc9ae3eeb73f2c346785576142fcfc3ce825101

		return res
			.status(500)
			.json({ message: "Internal server error.", success: false });
	}
});

router.post("/getWorklogs", async (req, res) => {
	try {
		const { teacherId, page = 1, limit = 15 } = req.body;

<<<<<<< HEAD
        if (!teacherId) {
            return res.json({
                message: "User ID is required.",
                success: false,
            });
        }
=======
		if (!teacherId) {
			return res
				.status(400)
				.json({ message: "User ID is required.", success: false });
		}
>>>>>>> 9fc9ae3eeb73f2c346785576142fcfc3ce825101

		const offset = (page - 1) * limit;

		const { rows } = await turso.execute(
			`
        SELECT id, year, course, date, hour, subject, topics
        FROM worklogs
        WHERE teacherId = ?
        ORDER BY createdAt DESC LIMIT ? OFFSET ?
    `,
			[teacherId, limit, offset]
		);

		const totalCountResult = await turso.execute(
			"SELECT COUNT(*) as count FROM worklogs WHERE teacherId = ?",
			[teacherId]
		);
		const totalCount = totalCountResult.rows[0].count;

		const hasMore = page * limit < totalCount;

<<<<<<< HEAD
        return res.json({
            data: rows,
            hasMore,
            nextPage: page + 1,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching worklogs:", error);

        return res
            .status(500)
            .json({ message: "Internal server error.", success: false });
    }
});

router.post("/getTeacherInfo", async (req, res) => {
    try {
        const { userId } = req.body;

        console.log(userId)

        if (!userId)
            return res.json({
                message: "User ID is required.",
                success: false,
            });

        const { rows: info } = await turso.execute(` 
            SELECT t.teacherId, c.year as in_charge_year, c.course as in_charge_course 
                FROM teachers t
                    LEFT JOIN
                        classes c ON t.teacherId = c.in_charge 
                WHERE t.teacherId = ?; 
        `, [userId]);


        return res.json({ info: info[0], success: true });
    } catch (error) {
        console.error("Error fetching worklogs:", error);
=======
		return res
			.status(200)
			.json({ data: rows, hasMore, nextPage: page + 1, success: true });
	} catch (error) {
		console.error("Error fetching worklogs:", error);
>>>>>>> 9fc9ae3eeb73f2c346785576142fcfc3ce825101

		return res
			.status(500)
			.json({ message: "Internal server error.", success: false });
	}
});

router.post("/sync", async (req, res) => {
	try {
		const { userId } = req.body;

		console.log(userId);

		if (!userId)
			return res
				.status(400)
				.json({ message: "User ID is required.", success: false });

		const { rows: user } = await turso.execute(
			"SELECT year as in_charge_year, course as in_charge_course FROM classes WHERE in_charge = ?",
			[userId]
		);

		return res.status(200).json({ success: true, user: user[0] });
	} catch (error) {
		console.error("Error fetching worklogs:", error);

		return res
			.status(500)
			.json({ message: "Internal server error.", success: false });
	}
});

export default router;
