import { turso } from "../../config/turso.js";

export const fetchParents = async (req, res) => {
    try {
        const { userId } = req.user;

        const { rows: parents } = await turso.execute(
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
            GROUP BY p.userId;
        `,
            [userId]
        );

        res.json({
            success: true,
            parents: parents.map(parent => ({
                ...parent,
                students: JSON.parse(parent.students || "[]")
            }))
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Internal Server Error"
        });
        console.error(error);
    }
};

export const verifyParent = async (req, res) => {
    try {
        const { parentId, studentId } = req.body;

        if (!parentId)
            return res.json({
                success: false,
                message: "parentId is required!"
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
    /* THIS FUNCTION DOESN'T REMOVE THE PARENT FROM THE USERS TABLE,
    INSTED IT UN VERIFY THE PARENT-STUDENT RELATION IN PARENT_CHILD 
    TABLE WHERE STUDENTS ARE FROM THE INCHARGE CLASS OF THE TEACHER.
    
    AFTER THAT, CHECK IF THE PARENT HAVE ANY OTHER VERIFIED RELATIONS,
    IF FALSE, THEN UN VERIFY THE PARENT IN USERS TABLE */

    try {
        const { parentId } = req.body;
        const { userId: teacherId } = req.user;

        if (!parentId) {
            return res.json({
                success: false,
                message: "parentId is required!"
            });
        }

        await turso.transaction(async tx => {
            await tx.execute(
                `
                UPDATE parent_child
                SET is_verified = 0
                WHERE parentId = ?
                  AND studentId IN (
                    SELECT s.userId
                    FROM students s
                    JOIN classes c
                      ON s.course = c.course
                     AND s.year = c.year
                    WHERE c.in_charge = ?
                  )
                `,
                [parentId, teacherId]
            );

            // Check if parent still has ANY verified child
            const result = await tx.execute(
                `
                SELECT 1
                FROM parent_child
                WHERE parentId = ?
                  AND is_verified = 1
                LIMIT 1
                `,
                [parentId]
            );

            if (result.rows.length === 0) {
                await tx.execute(
                    `
                  UPDATE users
                  SET is_verified = 0
                  WHERE userId = ?
                    AND role = 'parent'
                  `,
                    [parentId]
                );
            }
        });

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
