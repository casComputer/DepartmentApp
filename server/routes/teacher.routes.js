import express from "express";

import { turso } from "../config/turso.js";

const router = express.Router();

router.post("/saveWorklog", async (req, res) => {
    try {
        const { year, course, date, hour, subject, topics, teacherId } =
            req.body;

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
                success: false
            });
        }

        await turso.execute(
            `
        INSERT INTO worklogs (year, course, date, hour, subject, topics, teacherId)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
            [year, course, date, hour, subject, topics, teacherId]
        );

        return res
            .status(200)
            .json({ message: "Worklog saved successfully.", success: true });
    } catch (error) {
        // check sql uniwue constraint error
        if (error.message.includes("UNIQUE constraint failed")) {
            return res.status(400).json({
                message: "Worklog for the given date and hour already exists.",
                success: false
            });
        }
        console.error("Error saving worklog:", error);

        return res
            .status(500)
            .json({ message: "Internal server error.", success: false });
    }
});

router.post("/getWorklogs", async (req, res) => {
    try {
        const { teacherId, page = 1, limit = 15 } = req.body;

        if (!teacherId) {
            return res
                .status(400)
                .json({ message: "User ID is required.", success: false });
        }

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

        return res
            .status(200)
            .json({ data: rows, hasMore, nextPage: page + 1, success: true });
    } catch (error) {
        console.error("Error fetching worklogs:", error);

        return res
            .status(500)
            .json({ message: "Internal server error.", success: false });
    }
});

router.get("/sync", async (req, res) => {
    try {
        const { userId } = req.user;

        if (!userId)
            return res
                .status(400)
                .json({ message: "User ID is required.", success: false });

        const { rows: user } = await turso.execute(
            "SELECT c.year as in_charge_year, c.course as in_charge_course FROM classes c RIGHT JOIN teacher_courses tc ON c.in_charge = tc.teacherId WHERE in_charge = ?",
            [userId]
        );
        
        console.log(user);

        return res.json({ success: true, user: user[0] });
    } catch (error) {
        console.error("Error fetching worklogs:", error);

        return res
            .status(500)
            .json({ message: "Internal server error.", success: false });
    }
});

router.post("/addCourse", async (req, res) => {
    try {
        const { list } = req.body;
        const { userId, role } = req.user;

        const userField = role === "teacher" ? "teacherId" : "adminId";

        if (!list?.length) {
            return res.json({ success: true });
        }

        // Build placeholders
        const placeholders = list.map(() => "(?, ?, ?, ?)").join(", ");

        // Flatten values
        const values = list.flatMap(item => [
            userId,
            item.year,
            item.course,
            item.courseName
        ]);

        const query = `
      INSERT INTO teacher_courses (${userField}, year, course, course_name)
      VALUES ${placeholders}
    `;

        await turso.execute(query, values);

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "failed to save course details!" });
    }
});

export default router;
