import { turso } from "../../config/turso.js";

const getMonthlyAttendanceReport = async ({
  course,
  classYear, // class year (eg: "Third")
  month,
  calendarYear,
}) => {
  if (!course || !classYear || !month || !calendarYear) {
    throw new Error("course, classYear, month, calendarYear are required");
  }

  const monthStr = String(month).padStart(2, "0");
  const yearStr = String(calendarYear);

  const studentFilterSQL = studentId ? `AND ad.studentId = ?` : ``;

  const args = studentId
    ? [course, classYear, yearStr, monthStr, studentId]
    : [course, classYear, yearStr, monthStr];

  const result = await turso.execute({
    sql: `
        WITH daily_sections AS (
        SELECT
        ad.studentId,
        a.date,

        -- how many hours were actually conducted
        COUNT(DISTINCT CASE
        WHEN a.hour IN ('First','Second','Third')
        THEN a.hour END
        ) AS first_total,

        COUNT(DISTINCT CASE
        WHEN a.hour IN ('Fourth','Fifth')
        THEN a.hour END
        ) AS second_total,

        -- present hours
        SUM(CASE
        WHEN a.hour IN ('First','Second','Third')
        AND ad.status IN ('present','late')
        THEN 1 ELSE 0 END
        ) AS first_present,

        SUM(CASE
        WHEN a.hour IN ('Fourth','Fifth')
        AND ad.status IN ('present','late')
        THEN 1 ELSE 0 END
        ) AS second_present

        FROM attendance_details ad
        JOIN attendance a
        ON ad.attendanceId = a.attendanceId

        WHERE a.course = ?
        AND a.year = ?
        AND strftime('%Y', a.date) = ?
        AND strftime('%m', a.date) = ?
        ${studentFilterSQL}

        GROUP BY ad.studentId, a.date

        -- 🔥 CRITICAL FIX: exclude days where no hours were conducted
        HAVING NOT (
        COUNT(DISTINCT CASE
        WHEN a.hour IN ('First','Second','Third','Fourth','Fifth')
        THEN a.hour END
        ) = 0
        )
        ),

        daily_attendance AS (
        SELECT
        studentId,
        date,

        CASE
        -- BOTH HALVES CONDUCTED
        WHEN first_total > 0 AND second_total > 0 THEN
        CASE
        WHEN first_present = first_total
        AND second_present = second_total
        THEN 1.0
        WHEN first_present < first_total
        AND second_present < second_total
        THEN 0.0
        ELSE 0.5
        END

        -- ONLY FIRST HALF CONDUCTED
        WHEN first_total > 0 AND second_total = 0 THEN
        CASE
        WHEN first_present = first_total THEN 1.0
        WHEN first_present = 0 THEN 0.0
        ELSE 0.5
        END

        -- ONLY SECOND HALF CONDUCTED
        WHEN first_total = 0 AND second_total > 0 THEN
        CASE
        WHEN second_present = second_total THEN 1.0
        WHEN second_present = 0 THEN 0.0
        ELSE 0.5
        END

        ELSE NULL
        END AS attendance_value
        FROM daily_sections
        )

        SELECT
        studentId,
        COUNT(attendance_value) AS working_days,
        SUM(attendance_value) AS present_days,
        COUNT(attendance_value) - SUM(attendance_value) AS absent_days,
        ROUND(
        (SUM(attendance_value) * 100.0) / COUNT(attendance_value),
        2
        ) AS attendance_percentage
        FROM daily_attendance
        GROUP BY studentId
        ORDER BY studentId;
        `,
    args,
  });

  return result.rows;
};

export const generateAttendanceReport = async (req, res) => {
  try {
    const { course, year: classYear, month, calendarYear } = req.body;

    const { role, userId } = req.user;

    const data = await getMonthlyAttendanceReport({
      course,
      classYear,
      month,
      calendarYear,
      studentId: role === "student" ? userId : null,
    });

    res.json({
      course,
      classYear,
      month,
      calendarYear,
      scope: role === "student" ? "STUDENT" : "CLASS",
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
};
