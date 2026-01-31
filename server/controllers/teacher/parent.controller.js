import { turso } from "../../config/turso.js";

export const fetchParents = async (req, res) => {
    try {
        const { userId } = req.user;

        const { rows: parents } = await turso.execute(
            `
SELECT DISTINCT p.*, pc.*
FROM classes c
JOIN students s
    ON s.course = c.course
   AND s.year = c.year
JOIN parent_child pc
    ON pc.studentId = s.userId
JOIN users p
    ON p.userId = pc.parentId
WHERE c.in_charge = ? AND p.role = 'parent';
`,
            [userId]
        );

        res.json({
            success: true,
            parents
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Internal Server Error'
        });
        console.error(error);
    }
};
