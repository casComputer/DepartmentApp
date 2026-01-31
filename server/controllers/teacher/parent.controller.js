import { turso } from "../../config/turso.js";

export const fetchParents = async (req, res) => {
    try {
        const { userId } = req.user;
        const { page = 1, limit = 15 } = req.body;

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const offset = (pageNum - 1) * limitNum;

        const { rows } = await turso.execute(
            `
            SELECT
                p.userId,
                p.fullname,
                p.email,
                p.about,
                p.phone,
                p.dp,
                p.is_verified,
                json_group_array(
                    json_object(
                        'studentId', pc.studentId,
                        'isVerified', pc.is_verified
                    )
                ) AS students
            FROM classes c
            JOIN students s
                ON s.course = c.course
               AND s.year = c.year
            JOIN parent_child pc
                ON pc.studentId = s.userId
            JOIN users p
                ON p.userId = pc.parentId
            WHERE c.in_charge = ?
              AND p.role = 'parent'
            GROUP BY p.userId
            ORDER BY pc.joinedAt DESC
            LIMIT ? OFFSET ?;
            `,
            [userId, limitNum + 1, offset]
        );

        const hasMore = rows.length > limitNum;
        const parents = rows.slice(0, limitNum).map(parent => ({
            ...parent,
            students: JSON.parse(parent.students || "[]").filter(Boolean)
        }));

        res.json({
            success: true,
            parents,
            hasMore,
            nextPage: hasMore ? pageNum + 1 : null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const verifyParent = async (req, res) => {
    try {
        const { parentId, studentId } = req.body;

        if (!parentId || !studentId)
            return res.json({
                success: false,
                message: "parentId and studentId is required!"
            });

        await turso.execute(
            `
                UPDATE parent_child
                SET is_verified = 1
                WHERE parentId = ?
                  AND studentId = ?
                `,
            [parentId, studentId]
        );

        res.json({
            success: true
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Internal Server Error"
        });
        console.error(error);
    }
};

export const removeParent = async (req, res) => {
    try {
        const { parentId, studentId } = req.body;

        if (!parentId || !studentId) {
            return res.json({
                success: false,
                message: "parentId and studentId is required!"
            });
        }

        await turso.execute(
            `
                DELETE FROM parent_child
                    WHERE parentId = ? AND studentId = ?
                `,
            [parentId, studentId]
        );

        res.json({
            success: true
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Internal Server Error"
        });
        console.error(error);
    }
};
