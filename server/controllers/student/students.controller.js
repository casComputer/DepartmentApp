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
      "SELECT studentId, fullname, rollno, is_verified, dp from students where course = ? and year_of_study = ? and is_verified = true",
      [course, year]
    );

    const students = result?.rows || [];

    res.json({
      students,
      numberOfStudents: students?.length || 0,
      success: true,
      course,
      year,
    });
  } catch (err) {
    console.error("Error while fetching student details: ", err);
    res.status(500).json({
      error: "Error while fetching student details",
      success: false,
    });
  }
};

export const fetchStudentsByClassTeacher = async (req, res) => {
  const { userId: teacherId, role } = req.user;
  
  if(role !== 'teacher' || role !== 'admin') return res.json({ success: false, message: 'UnAutherized request!'})
  
  const field = role === 'teacher' ? 'in_charge_teacher' : 'in_charge_admin'

  try {
    const classResult = await turso.execute(
      `
            SELECT course, year 
            FROM classes
            WHERE ${field} = ?
            `,
      [teacherId]
    );

    if (classResult.rows.length === 0) {
      return res.json({
        success: false,
        message: "Teacher is not assigned to any class!",
      });
    }

    const { course, year } = classResult.rows[0];

    const studentResult = await turso.execute(
      `
            SELECT studentId, fullname , is_verified, dp, rollno 
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
        year,
      });
    }

    return res.json({
      success: true,
      course,
      year,
      students: studentResult.rows,
    });
  } catch (err) {
    console.error("Error while fetching student details:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching student details",
    });
  }
};

export const saveStudentDetails = async (req, res) => {
  try {
    const { studentId, rollno } = req.body;

    // assign roll number
    await turso.execute(
      `
			update students set rollno = ? where studentId = ?
		`,
      [rollno, studentId]
    );

    res.json({
      success: true,
      message: "Student details saved successfully",
    });
  } catch (err) {
    if (
      err.code === "SQLITE_CONSTRAINT" ||
      err.rawCode === "SQLITE_CONSTRAINT" ||
      err.message.includes("UNIQUE constraint failed")
    ) {
      return res.json({
        success: false,
        error: "SQLITE_CONSTRAINT",
        message:
          "This roll number is already assigned to another student in this class.",
      });
    }
    console.error("Error while saving student details", err);
    res.status(500).json({
      message: "Internal Error: while saving student details",
      error: "INTERNAL_ERROR",
      success: false,
    });
  }
};
