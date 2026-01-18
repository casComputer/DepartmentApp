import {
  turso
} from "../../config/turso.js";

import {
  getFirstAndLastDate,
  getRemainingWorkSummary
} from "../../utils/workHour.js";



export const generateAttendanceCalendarReport = async (req, res) => {
  try {
    const {
      month,
      year
    } = req.body;
    const {
      userId
    } = req.user;

    const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).toISOString().slice(0, 10);

    const {
      rows
    } = await turso.execute(
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
        absent_hours: row.absent_hours
      };
    }

    res.json({
      success: true,
      report
    });
  } catch (err) {
    console.error("Error while generating attendance calendar: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error!"
    });
  }
};

export const getTodaysAttendanceReport = async (req, res) => {
  try {
    const {
      userId
    } = req.body;

    const today = new Date();

    const date = today.toISOString().slice(0, 10);

    const {
      rows
    } = await turso.execute(
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
      success: true
    });
  } catch (err) {
    console.error("Error while getting daily attendance report: ", err);
    res.json({
      mesage: "internal server error", success: false
    });
  }
};

const calculateProjections = (
  present,
  total,
  remainingClasses,
  targetThreshold = 75
) => {
  const finalTotal = total + remainingClasses;
  const maxPossiblePresent = present + remainingClasses;
  const maxPossiblePercent = (maxPossiblePresent / finalTotal) * 100;

  const isCritical = maxPossiblePercent < targetThreshold;

  let safetyMarginClasses = Math.floor(
    present + remainingClasses - (targetThreshold / 100) * finalTotal
  );

  if (isCritical || safetyMarginClasses < 0) {
    safetyMarginClasses = 0;
  }

  return {
    maxPossiblePercent: Number(maxPossiblePercent.toFixed(2)),
    safetyMarginClasses,
    isCritical
  };
};

export const overallAttendenceReport = async (req, res) => {
  try {
    const {
      userId
    } = req.user;
    const {
      first,
      last
    } = getFirstAndLastDate();
    const {
      remainingDays,
      remainingHours: remainingClasses
    } =
    getRemainingWorkSummary();

    // -------- Student Monthly Data --------
    const {
      rows
    } = await turso.execute(
      `
      SELECT
      COUNT(*) AS total_classes,
      SUM(CASE WHEN ad.status IN ('present','late') THEN 1 ELSE 0 END) AS total_present,
      SUM(CASE WHEN ad.status = 'absent' THEN 1 ELSE 0 END) AS total_absent,
      COUNT(DISTINCT a.date) AS workedDays,
      a.course,
      a.year
      FROM attendance_details ad
      JOIN attendance a
      ON a.attendanceId = ad.attendanceId
      WHERE ad.studentId = ?
      AND a.date BETWEEN ? AND ?
      `,
      [userId, first, last]
    );

    if (!rows.length || rows[0].total_classes === 0) {
      return res.json({
        success: true,
        report: {
          summary: {
            status: "No Data",
            currentPercentage: 0,
            classesAttended: 0,
            totalClassesSoFar: 0,
          },
          time_analysis: {
            passedWorkingDays: 0,
            remainingDays,
            remainingHours: remainingClasses
          },
          comparison: {
            yourRank: null,
            totalStudents: 0,
            classAverage: 0,
            diffFromAvg: 0,
            topPerformers: []
          },
          projections: {
            expectedMaxPercentage: 0,
            safetyMarginClasses: 0,
            message: "No attendance data available"
          }
        }
      });
    }

    const studentData = rows[0];
    const {
      course,
      year,
      total_classes,
      total_present,
      workedDays
    } = studentData;

    const currentPercentage = Number(
      ((total_present / total_classes) * 100).toFixed(2)
    );

    // -------- Leaderboard --------
    const leaderboardQuery = `
    SELECT
    ad.studentId,
    s.dp,
    
    CAST(
    SUM(CASE WHEN ad.status IN ('present','late') THEN 1 ELSE 0 END)
    AS FLOAT
    ) / COUNT(*) * 100 AS pct
    
    FROM attendance_details ad
    
    JOIN attendance a ON a.attendanceId = ad.attendanceId
    JOIN students s ON s.studentId = ad.studentId 
    
    WHERE a.course = ?
    AND a.year = ?
    AND a.date BETWEEN ? AND ?
    
    GROUP BY ad.studentId
    ORDER BY pct DESC
    `;

    const leaderboardResult = await turso.execute(
      leaderboardQuery,
      [course, year, first, last]
    );

    const classRows = leaderboardResult.rows || [];

    const classAverage =
    classRows.length === 0
    ? 0: Number(
      (
        classRows.reduce((acc, row) => acc + row.pct, 0) /
        classRows.length
      ).toFixed(2)
    );

    const studentRankIndex = classRows.findIndex(
      row => row.studentId === userId
    );

    const currentRank =
    studentRankIndex === -1 ? null: studentRankIndex + 1;

    const top3 = classRows.slice(0, 3).map((row, index) => ({
      rank: index + 1,
      percentage: Number(row.pct.toFixed(2)),
      isMe: row.studentId === userId,
      studentId: row.studentId,
      dp: row.dp
    }));

    // -------- Projections --------
    const projections = calculateProjections(
      total_present,
      total_classes,
      remainingClasses
    );

    // -------- Response --------
    return res.json({
      success: true,
      report: {
        summary: {
          status: projections.isCritical ? "Critical": "Good",
          currentPercentage,
          classesAttended: total_present,
          totalClassesSoFar: total_classes,
        },
        time_analysis: {
          passedWorkingDays: Number(workedDays || 0),
          remainingDays,
          remainingHours: remainingClasses
        },
        comparison: {
          yourRank: currentRank,
          totalStudents: classRows.length,
          classAverage,
          diffFromAvg: Number(
            (currentPercentage - classAverage).toFixed(2)
          ),
          topPerformers: top3
        },
        projections: {
          expectedMaxPercentage: projections.maxPossiblePercent,
          safetyMarginClasses: projections.safetyMarginClasses,
          message: projections.isCritical
          ? `Attention: Even with 100% attendance, your maximum possible reach is ${projections.maxPossiblePercent}%.`: `You can afford to miss ${projections.safetyMarginClasses} more individual periods and still maintain ${75}%.`
        }
      }
    });
  } catch (err) {
    console.error("Error while fetching monthly attendance report:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!"
    });
  }
};

export const getYearlyAttendanceReport = async (req, res) => {
  try {
    const {
      year
    } = req.body;
    const {
      userId
    } = req.user;

    if (!year)
      return res.json({
      success: false, message: "year is missing!"
    });

    const {
      rows
    } = await turso.execute(
      `
      SELECT
      strftime('%m', a.date) AS month,
      COUNT(ad.attendanceId) AS value,

      (COUNT(CASE WHEN ad.status = 'present' THEN 1 END) * 100.0)
      / (COUNT(DISTINCT a.date) * 5) AS percentage

      FROM attendance a
      JOIN students s
      ON s.year_of_study = a.year
      AND s.course = a.course
      JOIN attendance_details ad
      ON ad.attendanceId = a.attendanceId
      AND ad.studentId = s.studentId
      WHERE s.studentId = ?
      AND strftime('%Y', a.date) = ?
      GROUP BY month
      ORDER BY month
      `,
      [userId, year?.toString()]
    );

    res.json({
      success: true,
      rows
    });
  } catch (err) {
    console.error("Error while fetching yearly attendance report: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error!"
    });
  }
};