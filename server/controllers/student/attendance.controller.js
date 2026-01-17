import { turso } from "../../config/turso.js";

import {
  getFirstAndLastDate,
  getRemainingWorkSummary,
} from "../utils/workHour.js";

export const generateAttendanceCalendarReport = async (req, res) => {
  try {
    const { month, year } = req.body;
    const { userId } = req.user;

    const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).toISOString().slice(0, 10);

    const { rows } = await turso.execute(
      `
            SELECT
        a.date,
        a.timestamp,
      
        CASE
          WHEN SUM(
            CASE 
              WHEN ad.status IN ('present', 'late') THEN 1 
              ELSE 0 
            END
          ) > 0
          THEN 'present'
          ELSE 'absent'
        END AS day_status,
      
        COUNT(*) AS total_hours,
      
        SUM(CASE WHEN ad.status = 'present' THEN 1 ELSE 0 END) AS present_hours,
        SUM(CASE WHEN ad.status = 'late' THEN 1 ELSE 0 END) AS late_hours,
        SUM(CASE WHEN ad.status = 'absent' THEN 1 ELSE 0 END) AS absent_hours
      
      FROM attendance a
      JOIN attendance_details ad
        ON a.attendanceId = ad.attendanceId
      
      WHERE
        ad.studentId = ?
        AND a.date BETWEEN ? AND ?
      
      GROUP BY a.date
      ORDER BY a.date;
      
            `,
      [userId, firstDay, lastDay]
    );

    const report = {};

    for (const row of rows) {
      report[row.date] = {
        status: row.day_status,
        total_hours: row.total_hours,
        present_hours: row.present_hours,
        late_hours: row.late_hours,
        absent_hours: row.absent_hours,
      };
    }

    console.log(report);

    res.json({
      success: true,
      report,
    });
  } catch (err) {
    console.error("Error while generating attendance calendar: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

export const getTodaysAttendanceReport = async (req, res) => {
  try {
    const { userId } = req.body;

    const today = new Date();

    const date = today.toISOString().slice(0, 10);

    const { rows } = await turso.execute(
      `
            SELECT *
                FROM attendance a
                JOIN students s
                    ON s.year_of_study = a.year
                    AND s.course = a.course
                
                JOIN attendance_details ad
                    ON ad.attendanceId = a.attendanceId
                    AND ad.studentId = s.studentId


            WHERE s.studentId = ?
            AND a.date = ?
        `,
      [userId, date]
    );

    let attendance = rows.reduce((acc, item) => {
      acc[item.hour] = item.status;
      return acc;
    }, {});

    res.json({
      attendance,
      success: true,
    });
  } catch (err) {
    console.error("Error while getting daily attendance report: ", err);
    res.json({ mesage: "internal server error", success: false });
  }
};

export const getMonthlyAttendanceMiniReport = async (req, res) => {
  try {
    const { userId } = req.body;

    const { first, last } = getFirstAndLastDate();

    const { rows } = await turso.execute(
      `
            SELECT
                COUNT(CASE WHEN ad.status = 'present' THEN 1 END) AS total_present,
                COUNT(DISTINCT a.date) AS workedDays,
                
                (COUNT(CASE WHEN ad.status = 'present' THEN 1 END) * 100.0) 
                    / (COUNT(DISTINCT a.date) * 5) AS percentage
            
            FROM attendance_details ad
            
            JOIN attendance a
                ON a.attendanceId = ad.attendanceId
            
            WHERE ad.studentId = ?
                AND a.date BETWEEN ? AND ?
                
            GROUP BY ad.studentId;`,
      [userId, first, last]
    );

    const { remainingDays, remainingHours } = getRemainingWorkSummary();
    if (rows.length > 0) {
      const workedDays = rows[0].workedDays || 0;

      return res.json({
        success: true,
        report: { ...rows[0], workedDays, remainingHours, remainingDays },
      });
    }

    res.json({
      success: false,
      message: "No data available, try again later!",
      report: {
        remainingDays,
        remainingHours,
      },
    });
  } catch (err) {
    console.error("Error while fetching monthly attendance report: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};
