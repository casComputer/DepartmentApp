import { turso } from "../../config/turso.js";

export const saveWorklog = async (req, res) => {
    try {
        const { year, course, date, hour, subject, topics } = req.body;

        const { userId: teacherId } = req.user;

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
};

export const getWorklogs = async (req, res) => {
    try {
        let { page = 1, limit = 15, teacherId } = req.body;

        const { userId, role } = req.user;

        if (!teacherId && role === "admin") teacherId = userId;

        if (!teacherId) {
            return res
                .status(400)
                .json({ message: "Teacher ID is required.", success: false });
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
};
