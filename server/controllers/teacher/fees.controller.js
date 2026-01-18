import { turso } from "../../config/turso.js";

export const create = async (req, res) => {
    try {
        const { dueDate, details, year, course, amount } = req.body;
        const { role, userId } = req.user;

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
};

export const fetch = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.body;
        const { role, userId } = req.user;

        const ids = {
            teacher: "teacherId",
            admin: "adminId"
        };

        const column = ids[role];

        if (!column)
            return res.json({
                success: false,
                message: "Invalid role"
            });

        const offset = (page - 1) * limit;

        const feesQuery = `
            SELECT *
            FROM fees
            WHERE ${column} = ?
            ORDER BY timestamp DESC
            LIMIT ? OFFSET ?
        `;

        const countQuery = `
            SELECT COUNT(*) as count
            FROM fees
            WHERE ${column} = ?
        `;

        const { rows: fees } = await turso.execute(feesQuery, [
            userId,
            limit,
            offset
        ]);

        const { rows: countRows } = await turso.execute(countQuery, [userId]);

        const totalCount = countRows[0]?.count || 0;
        const hasMore = page * limit < totalCount;

        return res.json({
            success: true,
            fees,
            nextPage: hasMore ? page + 1 : null,
            hasMore
        });
    } catch (error) {
        console.error("fetchByTeacher error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const deleteFee = async () => {
    try {
        const { feeId } = req.body;
        if (!feeId)
            return res.json({ success: false, message: "feeid is missing!" });

        await turso.execute(`DELETE FROM fees WHERE feeId = ?`, [feeId]);

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Internal server error!" });
    }
};
