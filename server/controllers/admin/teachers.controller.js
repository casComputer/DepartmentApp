import { turso } from "../../config/turso.js";
import { YEAR, COURSES } from "../../constants/YearAndCourse.js";
import { validateCourseAndYear } from "../../utils/validateCourseAndYear.js";

export const getTeachers = async (req, res) => {
    try {
        const result = await turso.execute(
            "SELECT t.teacherId, t.fullname, t.is_verified, c.course as in_charge_course, c.year AS in_charge_year FROM teachers t LEFT JOIN classes c ON c.in_charge = t.teacherId"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching teachers:", error, error.message);
        res.status(500).json({
            error: "Internal Server Error",
            success: false
        });
    }
};

export const assignClass = async (req, res) => {
    try {
        const { course, year, teacherId } = req.body;

        if (!validateCourseAndYear(course, year))
            return res
                .status(405)
                .json({ message: "invalid course or year", success: false });

        const { rows: isExists } = await turso.execute(
            `
            select teacherId from classes where year = ? and course = ? and in_charge IS NOT NULL   
        `,
            [year, course]
        );

        if (isExists[0]?.length > 0)
            return res.json({
                message: `Class already assigned to ${isExists[0].teacherId}`,
                success: false
            });

        const { rows: teacherExists } = await turso.execute(
            `
            select * from classes where in_charge = ?   
        `,
            [teacherId]
        );

        console.log(teacherExists);

        return;

        await turso.execute(
            `
        	update classes set in_charge = ? where year = ? and course = ?
        `,
            [teacherId, year, course]
        );

        res.json({ message: "Class assigned successfully", success: true });
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const verifyTeacher = async (req, res) => {
    const { teacherId } = req.body;

    try {
        await turso.execute(
            `update teachers set is_verified = TRUE where teacherId = ?`,
            [teacherId]
        );
        res.json({ message: "Teacher verified successfully", success: true });
    } catch (error) {
        console.error("Error verifying teacher:", error);
        res.status(500).json({
            error: "Internal Server Error",
            success: false
        });
    }
};
