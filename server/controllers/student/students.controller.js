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
		
		
		// assign roll number
		await turso.execute(`
			update students set rollno = ? where studentId = ?
		`, [rollno, studentId])
		
		
		res.json({
			success: true,
			message: 'Student details saved successfully'
		})
		
		
	}catch(err){
	
		if (err.code === "SQLITE_CONSTRAINT" || 
	       		 err.rawCode === "SQLITE_CONSTRAINT" || 
			err.message.includes("UNIQUE constraint failed")) 
	        {
			return res.json({
			    success: false,
			    error:"SQLITE_CONSTRAINT",
			    message: "This roll number is already assigned to another student in this class."
			});
		    }
		console.error("Error while saving student details", err)
		res.status(500).json({ message: "Internal Error: while saving student details", error:"INTERNAL_ERROR", success: false })
	}

	

}

export const verifyMultipleStudents = async (req, res) => {
    try {
        const { students } = req.body;

        if (!Array.isArray(students) || students.length === 0) 
            return res.status(400).json({ error: "students must be a non-empty array" });
        
        // Build placeholders: (?, ?, ?, ...)
        const placeholders = students.map(() => '?').join(',');

        const query = `
            UPDATE students 
            SET is_verified = true 
            WHERE studentId IN (${placeholders})
        `;

        await turso.execute(query, students);

        res.json({ success: true, message: 'students verified' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}



 export const autoAssignRollNoAlphabetically = async (req, res) => {
  try {
    const { course, year } = req.body;

    if (!course || !year) {
      return res.status(400).json({ error: "course and year are required" });
    }
    
    await turso.execute(
	  `UPDATE students SET rollno = NULL WHERE course = ? AND year_of_study = ?`,
	  [course, year]
	);


    // Fetch students sorted by name
    const { rows: students } = await turso.execute(
      `
	      SELECT studentId, fullname
	      FROM students
	      WHERE course = ? 
		AND year_of_study = ?
	      ORDER BY fullname ASC
	      `,
	      [course, year]
	    );

    // Assign roll numbers
    let rollno = 1, updated = [];

    for (const s of students) {
      await turso.execute(
        `
        UPDATE students
        SET rollno = ?
        WHERE studentId = ?
        `,
        [rollno, s.studentId]
      );
      
      updated.push({ ...s, rollno })

      rollno++;
    }
    
    res.json({ success: true,  students: updated });

  } catch (err) {
    console.log("Error while assigning roll numbers:", err);
    res.status(500).json({ error: "Internal error", success: false });
  }
}

export const assignRollNo = async (req, res) => {
    try {
        const { students } = req.body; 
        
        if (!Array.isArray(students)) {
            return res.status(400).json({
                success: false,
                message: "students must be an array"
            });
        }

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
}
