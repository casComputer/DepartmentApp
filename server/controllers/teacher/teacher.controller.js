import { turso } from "../../config/turso.js";

export const syncUser = async (req, res) => {
    console.log("userId:", req.user.userId);
    try {
        const { userId } = req.user;

        if (!userId)
            return res.status(400).json({
                message: "User ID is required.",
                success: false,
            });

        const { rows } = await turso.execute(
            `SELECT
            c.year as in_charge_year,
            c.course as in_charge_course,
            tc.year, tc.course, tc.course_name

            FROM classes c RIGHT JOIN teacher_courses tc
            ON c.in_charge = tc.teacherId
            WHERE in_charge = ?`,
            [userId],
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

        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};

export const fetchAllTeachers = async (req, res) => {
    try {
        const { rows } = await turso.execute(`
            SELECT
            u.userId as teacherId,
            u.fullname,
            u.dp,
            u.phone,
            u.about,
            u.email

            tc.course,
            tc.year,
            tc.course_name,

            c.course as in_charge_course,
            c.year as in_charge_year,

            FROM users u

            LEFT JOIN classes c ON u.userId = c.in_charge
            left JOIN teacher_courses tc ON u.userId = tc.teacherId

            WHERE u.is_verified = 1 AND u.role = 'teacher'
            ORDER BY u.fullname ASC
        `);

        const result = rows.map((row) => ({
            teacherId: row.teacherId,
            fullname: row.fullname,
            dp: row.dp,
            courses: [],
            inCharge: row.in_charge_course
                ? {
                      course: row.in_charge_course,
                      year: row.in_charge_year,
                  }
                : null,
        }));

        // Aggregate courses for each teacher
        const teachersMap = new Map();

        result.forEach((teacher) => {
            if (!teachersMap.has(teacher.teacherId)) {
                teachersMap.set(teacher.teacherId, {
                    ...teacher,
                    courses: [],
                });
            }
        });

        rows.forEach((row) => {
            if (teachersMap.has(row.teacherId) && row.course) {
                teachersMap.get(row.teacherId).courses.push({
                    course: row.course,
                    year: row.year,
                    course_name: row.course_name,
                });
            }
        });

        const finalResult = Array.from(teachersMap.values());

        res.json({
            success: true,
            teachers: finalResult,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server Error",
            success: false,
        });
    }
};
