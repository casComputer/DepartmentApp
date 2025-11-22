import { turso } from "../../config/turso.js";
import { validateCourseAndYear } from "../../utils/validateCourseAndYear.js";

export const fetchStudentsByClass = async (req, res) => {
    const { course, year } = req.body;

    try {
        if (!validateCourseAndYear(course, year))
            return res
                .status(405)
                .json({ message: "invalid course or year", success: false });

        const result = await turso.execute(
            "SELECT studentId, fullname, rollno, is_verified from students where course = ? and year_of_study = ?",
            [course, year]
        );

        const students = result?.rows || [];

        res.json({
            students,
            numberOfStudents: students?.length || 0,
            success: true
        });
    } catch (err) {
        console.error("Error while fetching student details: ", err);
        res.status(500).json({
            error: "Error while fetching student details",
            success: false
        });
    }
};

export const fetchStudentsByClassTeacher = async (req, res) => {
    const { teacherId } = req.body;

    try {
        const classResult = await turso.execute(
            `
            SELECT course, year 
            FROM classes
            WHERE in_charge = ?
            `,
            [teacherId]
        );

        if (classResult.rows.length === 0) {
            return res.json({
                success: false,
                message: "Teacher is not assigned to any class!"
            });
        }

        const { course, year } = classResult.rows[0];

        const studentResult = await turso.execute(
            `
            SELECT studentId, fullname , is_verified, rollno 
            FROM students
            WHERE course = ? AND year_of_study = ?
            `,
            [course, year]
        );

        if (studentResult.rows.length === 0) {
            return res.json({
                success: false,
                message: "Class has no students yet!",
                course,
                year
            });
        }
        
        console.log(studentResult.rows)

        return res.json({
            success: true,
            course,
            year,
            students: studentResult.rows
        });
    } catch (err) {
        console.error("Error while fetching student details:", err);
        res.status(500).json({
            success: false,
            error: "Server error while fetching student details"
        });
    }
}

export const verifyStudent = async (req, res) => {
    const { studentId } = req.body;
   
    try {
        await turso.execute(
           'UPDATE students SET is_verified = true WHERE studentId = ?',
           [studentId]
        );

        res.json({ success: true, message: "Student verified" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
}

export const cancelStudentVerification = async (req, res) => {
    const { studentId } = req.body;
    
    try {
         await turso.execute(
            'DELETE FROM students WHERE studentId = ?',
            [studentId]
         );

        res.json({ success: true, message: "Student deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
}

export const saveStudentDetails = async (req, res)=> {
	
	try{
		const { studentId, rollno } = req.body
		
		await turso.execute(`
			update students set rollno = ? where studentId = ?
		`, [rollno, studentId])
		
		res.json({
			success: true,
			message: 'Student details saved successfully'
		})
		
		
	}catch(err){
		console.error("Error while saving student details")
		res.status(500).json({ message: "Internal Error: while saving student details", success: false })
	}

	

}