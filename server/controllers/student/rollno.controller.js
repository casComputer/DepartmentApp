import { turso } from "../../config/turso.js";
import { validateCourseAndYear } from "../../utils/validateCourseAndYear.js";


export const autoAssignRollNoAlphabetically = async (req, res) => {
    try {
        const { course, year } = req.body;

        if (!course || !year) {
            return res
                .status(400)
                .json({ error: "course and year are required" });
        }

        // Clear students' roll numbers
        await turso.execute(
            `UPDATE students 
             SET rollno = NULL 
             WHERE course = ? 
             AND year_of_study = ?`,
            [course, year]
        );

        // Fetch ONLY verified students sorted by name
        const { rows: verifiedStudents } = await turso.execute(
            `
            SELECT studentId, fullname
            FROM students
            WHERE course = ?
            AND year_of_study = ?
            AND is_verified = 1
            ORDER BY fullname ASC
            `,
            [course, year]
        );

        // Assign roll numbers
        let rollno = 1;
        const updated = [];

        for (const s of verifiedStudents) {
            await turso.execute(
                `
                UPDATE students
                SET rollno = ?
                WHERE studentId = ?
                `,
                [rollno, s.studentId]
            );

            updated.push({ ...s, rollno });
            rollno++;
        }

        res.json({ success: true, assignedCount: updated.length, students: updated });

    } catch (err) {
        console.log("Error while assigning roll numbers:", err);
        res.status(500).json({ error: "Internal error", success: false });
    }
};


export const assignGroupedRollNo = async (req, res) => {
    try {
        const { students, course, year } = req.body;

        if (!Array.isArray(students)) {
            return res.status(400).json({
                success: false,
                message: "students must be an array"
            });
        }

        if (!course || !year)
            return res.status(400).json({
                success: false,
                message: "course or year is not provided"
            });

        await turso.execute(
            `UPDATE students SET rollno = NULL WHERE course = ? AND year_of_study = ?`,
            [course, year]
        );

        const errors = [];
        const success = [];

        for (const stu of students) {
            const { studentId, rollno } = stu;

            try {
                await turso.execute(
                    `
                    UPDATE students 
                    SET rollno = ?
                    WHERE studentId = ?
                    `,
                    [rollno, studentId]
                );

                success.push({ studentId, rollno });
            } catch (err) {
                if (err.message?.includes("SQLITE_CONSTRAINT")) {
                    errors.push({
                        studentId,
                        rollno,
                        error: "Duplicate rollno for this course/year (unique constraint failed)"
                    });
                } else {
                    errors.push({
                        studentId,
                        rollno,
                        error: err.message || "Unknown DB error"
                    });
                }
            }
        }

        return res.status(200).json({
            success: true,
            updated: success,
            failed: errors
        });
    } catch (err) {
        console.error("Error in assignRollNo:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

