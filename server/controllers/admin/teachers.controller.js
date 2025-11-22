import { turso } from "../../config/turso.js";
import { YEAR, COURSES } from "../../constants/YearAndCourse.js";
import { validateCourseAndYear } from "../../utils/validateCourseAndYear.js"

export const getTeachers = async (req, res) => {
    try {
        const result = await turso.execute(
            "SELECT teacherId, fullname, is_verified, is_in_charge, in_charge_class, in_charge_year FROM teachers"
        );
        
        
        
        // todo: fetch in_charge details from classes table insted of teachers table
        
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching teachers:", error);
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

        await turso.execute(`
        	update classes set in_charge = ? where year = ? and course = ?
        `, 
        [teacherId, year, course]
        )

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
