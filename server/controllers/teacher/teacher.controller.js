import {
    turso
} from "../../config/turso.js";

export const syncUser = async (req, res) => {
    try {
        const {
            userId
        } = req.user;

        if (!userId)
            return res
        .status(400)
        .json({
            message: "User ID is required.", success: false
        });

        const {
            rows
        } = await turso.execute(
            `SELECT
            c.year as in_charge_year,
            c.course as in_charge_course,
            tc.year, tc.course, tc.course_name

            FROM classes c RIGHT JOIN teacher_courses tc
            ON c.in_charge = tc.teacherId
            WHERE in_charge = ?`,
            [userId]
        );

        const inCharge = {
            year: rows[0]?.in_charge_year || null,
            course: rows[0]?.in_charge_course || null,
        };

        return res.json({
            success: true,
            inCharge,
            courses: rows.map((row) => ({
                year: row.year,
                course: row.course,
                course_name: row.course_name,
            })),
        });
    } catch (error) {
        console.error("Error syncing teacher:", error);

        return res
        .status(500)
        .json({
            message: "Internal server error.", success: false
        });
    }
};

export const fetchAllTeachers = async(req, res)=> {
    try {
        const {
            rows
        } = await turso.execute(`
            SELECT
            t.teacherId,
            t.fullname,
            t.dp,

            tc.course,
            tc.year,
            tc.course_name,

            c.course as in_charge_course,
            c.year as in_charge_year

            FROM teachers t

            LEFT JOIN classes c ON t.teacherId = c.in_charge
            left JOIN teacher_courses tc ON t.teacherId = tc.teacherId

            WHERE t.is_verified = 1;
            `)
            
            
            
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: 'Internal server Error', success: false
        })
    }
}