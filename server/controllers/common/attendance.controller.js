import { turso } from "../../config/turso.js";

export const generateAttendanceCalendarReport = async (req, res) => {
    try {
        const { month, year, studentId } = req.body;
        let { userId, role } = req.user;

        if (role === "parent") userId = studentId;

        const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
        const lastDay = new Date(year, month, 0).toISOString().slice(0, 10);

        const { rows } = await turso.execute(
            `
      WITH daily_sections AS (
        SELECT
          a.date,

          COUNT(DISTINCT CASE
            WHEN a.hour IN ('First','Second','Third')
            THEN a.hour END
          ) AS first_total,

          COUNT(DISTINCT CASE
            WHEN a.hour IN ('Fourth','Fifth')
            THEN a.hour END
          ) AS second_total,

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

        FROM attendance a
        JOIN attendance_details ad
          ON a.attendanceId = ad.attendanceId

        WHERE ad.studentId = ?
          AND a.date BETWEEN ? AND ?

        GROUP BY a.date

        -- exclude holidays / no-class days
        HAVING
          COUNT(DISTINCT CASE
            WHEN a.hour IN ('First','Second','Third','Fourth','Fifth')
            THEN a.hour END
          ) > 0
      )

      SELECT
        date,
        CASE
          -- FULL DAY PRESENT
          WHEN first_present = first_total
           AND second_present = second_total
          THEN 'present'

          -- FULL DAY LEAVE
          WHEN first_present < first_total
           AND second_present < second_total
          THEN 'leave'

          -- HALF DAY LEAVE
          ELSE 'half-day'
        END AS status
      FROM daily_sections
      ORDER BY date;
      `,
            [userId, firstDay, lastDay]
        );

        const report = {};
        for (const row of rows) {
            report[row.date] = { status: row.status };
        }

        res.json({ success: true, report });
    } catch (err) {
        console.error("Error while generating attendance calendar:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
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
            studentId: role === "student" ? userId : null
        });

        res.json({
            course,
            classYear,
            month,
            calendarYear,
            scope: role === "student" ? "STUDENT" : "CLASS",
            data
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message || "Internal server error"
        });
    }
};
