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
                        'studentId', pc.studentId
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
        
        const students = JSON.parse(parent.students) ?? []
        
        res.json({
            success: true,
            parents: parents.map(parent => ({
                ...parent,
                students: students.map(st=> st.studentId)
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
