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
      "SELECT u.studentId, u.fullname, s.rollno, u.is_verified, u.dp from students s JOIN users u ON s.studentId = u.userId where s.course = ? and s.year = ? and u.is_verified = true",
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
        message: "Teacher is not assigned to any class!",
      });
    }

    const { course, year } = classResult.rows[0];

    const studentResult = await turso.execute(
      `
            SELECT u.userId, u.fullname , u.is_verified, u.dp, s.rollno 
            FROM students s
            JOIN users u ON s.studentId = u.userId
            WHERE s.course = ? AND s.year = ?
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
			update students set rollno = ? where userId = ?
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
