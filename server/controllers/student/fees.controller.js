import { turso } from "../../config/turso.js";

export const fetch = async (req, res) => {
    try {
        const { course, year, page = 1, limit = 10 } = req.body;

        if (!course || !year) {
            return res.json({
                success: false,
                message: "Missing required parameters!"
            });
        }

        const offset = (page - 1) * limit;

        const feesQuery = `
            SELECT *
            FROM fees
            WHERE course = ? AND year = ? 
            ORDER BY timestamp DESC
            LIMIT ? OFFSET ?
        `;

        const countQuery = `
            SELECT COUNT(*) as count
            FROM fees
            WHERE course = ? AND year = ? 
        `;

        const { rows: fees } = await turso.execute(feesQuery, [
            course,
            year,
            limit,
            offset
        ]);

        const { rows: countRows } = await turso.execute(countQuery, [
            course,
            year
        ]);

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
