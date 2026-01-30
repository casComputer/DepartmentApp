import { turso } from "../../config/turso.js";

import {
    getFirstAndLastDate,
    getRemainingWorkSummary,
    getRemainingOngoingDaysThisMonth
} from "../../utils/workHour.js";

import { getMonthlyAttendanceReport } from "../common/attendance.controller.js";

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

  WHERE
    ad.studentId = ?
    AND a.date BETWEEN ? AND ?

  GROUP BY a.date

  -- 🚫 remove holidays / no-class days
  HAVING (first_total > 0 OR second_total > 0)
),

daily_attendance AS (
  SELECT
    date,

    CASE
      -- BOTH HALVES
      WHEN first_total > 0 AND second_total > 0 THEN
        CASE
          WHEN first_present = first_total
           AND second_present = second_total
          THEN 1.0
          WHEN first_present = 0
           AND second_present = 0
          THEN 0.0
          ELSE 0.5
        END

      -- ONLY FIRST HALF
      WHEN first_total > 0 AND second_total = 0 THEN
        CASE
          WHEN first_present = first_total THEN 1.0
          WHEN first_present = 0 THEN 0.0
          ELSE 0.5
        END

      -- ONLY SECOND HALF
      WHEN first_total = 0 AND second_total > 0 THEN
        CASE
          WHEN second_present = second_total THEN 1.0
          WHEN second_present = 0 THEN 0.0
          ELSE 0.5
        END
    END AS attendance_value
  FROM daily_sections
)

SELECT
  date,
  CASE
    WHEN attendance_value = 1.0 THEN 'present'
    WHEN attendance_value = 0.5 THEN 'half-day'
    WHEN attendance_value = 0.0 THEN 'absent'
  END AS status
FROM daily_attendance
ORDER BY date;

            `,
            [userId, firstDay, lastDay]
        );

        const report = {};

        for (const row of rows) {
            report[row.date] = {
                status: row.status
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
        let { userId, role } = req.user;

        if (role === "parent") {
            userId = req.body.studentId;
            if (!userId)
                return res.json({
                    mesage: "StudenId is required!",
                    success: false
                });
        }

        const today = new Date();
        const date = today.toISOString().slice(0, 10);

        const { rows } = await turso.execute(
            `
            SELECT *
            FROM attendance a
            JOIN students s
            ON s.year = a.year
            AND s.course = a.course

            JOIN attendance_details ad
            ON ad.attendanceId = a.attendanceId
            AND ad.studentId = s.userId


            WHERE s.userId = ?
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
            mesage: "internal server error",
            success: false
        });
    }
};

const calculateProjections = (
    presentDays,
    totalWorkingDays,
    remainingDays,
    targetThreshold = 75
) => {
    const finalTotalDays = totalWorkingDays + remainingDays;
    const maxPossiblePresent = presentDays + remainingDays;

    const maxPossiblePercent =
        finalTotalDays === 0 ? 0 : (maxPossiblePresent / finalTotalDays) * 100;

    const isCritical = maxPossiblePercent < targetThreshold;

    let safetyMarginDays = Math.floor(
        maxPossiblePresent - (targetThreshold / 100) * finalTotalDays
    );

    if (isCritical || safetyMarginDays < 0) {
        safetyMarginDays = 0;
    }

    return {
        maxPossiblePercent: Number(maxPossiblePercent.toFixed(2)),
        safetyMarginClasses: safetyMarginDays,
        isCritical
    };
};

export const overallAttendenceReport = async (req, res) => {
    try {
        let { userId, role } = req.user;

        if (role === "parent") userId = req.body.studentId;

        const { first, last } = getFirstAndLastDate();
        const { remainingDays, remainingHours } = getRemainingWorkSummary();

        // -------- Student Info --------
        const { rows: studentRows } = await turso.execute(
            `
            SELECT course, year
            FROM students
            WHERE userId = ?
            `,
            [userId]
        );

        if (!studentRows.length) {
            return res.json({
                success: false,
                message: "No user data found"
            });
        }

        const { course, year } = studentRows[0];

        // -------- Monthly Attendance (NEW LOGIC) --------
        const now = new Date();

        const monthlyReport = await getMonthlyAttendanceReport({
            studentId: userId,
            month: now.getMonth() + 1,
            calendarYear: now.getFullYear()
        });

        if (!monthlyReport.length) {
            return res.json({
                success: false,
                message: "No attendance data found"
            });
        }

        const {
            working_days,
            present_days,
            absent_days,
            attendance_percentage
        } = monthlyReport[0];

        // -------- Leaderboard (SAME DAILY LOGIC) --------
        const leaderboardQuery = `
        WITH daily_sections AS (
        SELECT
        ad.studentId,
        a.date,

        COUNT(DISTINCT CASE
        WHEN a.hour IN ('First','Second','Third') THEN a.hour END
        ) AS first_total,

        COUNT(DISTINCT CASE
        WHEN a.hour IN ('Fourth','Fifth') THEN a.hour END
        ) AS second_total,

        SUM(CASE
        WHEN a.hour IN ('First','Second','Third')
        AND ad.status IN ('present','late') THEN 1 ELSE 0 END
        ) AS first_present,

        SUM(CASE
        WHEN a.hour IN ('Fourth','Fifth')
        AND ad.status IN ('present','late') THEN 1 ELSE 0 END
        ) AS second_present

        FROM attendance a
        JOIN attendance_details ad ON ad.attendanceId = a.attendanceId

        WHERE a.course = ?
        AND a.year = ?
        AND a.date BETWEEN ? AND ?

        GROUP BY ad.studentId, a.date
        ),

        daily_attendance AS (
        SELECT
        studentId,
        CASE
        WHEN first_total > 0 AND second_total > 0 THEN
        CASE
        WHEN first_present = first_total
        AND second_present = second_total THEN 1.0
        WHEN first_present = 0
        AND second_present = 0 THEN 0.0
        ELSE 0.5
        END

        WHEN first_total > 0 AND second_total = 0 THEN
        CASE
        WHEN first_present = first_total THEN 1.0
        WHEN first_present = 0 THEN 0.0
        ELSE 0.5
        END

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
        da.studentId,
        u.dp,
        ROUND(
        (SUM(da.attendance_value) * 100.0) / COUNT(da.attendance_value),
        2
        ) AS pct
        FROM daily_attendance da
        JOIN users u ON u.userId = da.studentId
        GROUP BY da.studentId
        ORDER BY pct DESC;
        `;

        const leaderboardResult = await turso.execute(leaderboardQuery, [
            course,
            year,
            first,
            last
        ]);

        const classRows = leaderboardResult.rows || [];

        const classAverage =
            classRows.length === 0
                ? 0
                : Number(
                      (
                          classRows.reduce((acc, row) => acc + row.pct, 0) /
                          classRows.length
                      ).toFixed(2)
                  );

        const studentRankIndex = classRows.findIndex(
            row => row.studentId === userId
        );

        const currentRank =
            studentRankIndex === -1 ? null : studentRankIndex + 1;

        const top3 = classRows.slice(0, 3).map((row, index) => ({
            rank: index + 1,
            percentage: row.pct,
            isMe: row.studentId === userId,
            studentId: row.studentId,
            dp: row.dp
        }));

        const effectiveRemainingDays =
            remainingDays > 0 && remainingHours > 0 ? remainingDays : 0;

        // -------- Projections (DAY BASED) --------
        const projections = calculateProjections(
            Number(present_days),
            Number(working_days),
            effectiveRemainingDays
        );

        // -------- Response (UNCHANGED STRUCTURE) --------
        return res.json({
            success: true,
            report: {
                summary: {
                    status: projections.isCritical ? "Critical" : "Good",
                    currentPercentage: attendance_percentage,
                    classesAttended: present_days,
                    totalClassesSoFar: working_days
                },
                time_analysis: {
                    passedWorkingDays: Number(working_days || 0),
                    remainingDays,
                    remainingHours,
                    ongoingDays: getRemainingOngoingDaysThisMonth() ?? 0
                },
                comparison: {
                    yourRank: currentRank,
                    totalStudents: classRows.length,
                    classAverage,
                    diffFromAvg: Number(
                        (attendance_percentage - classAverage).toFixed(2)
                    ),
                    topPerformers: top3
                },
                projections: {
                    expectedMaxPercentage: projections.maxPossiblePercent,
                    safetyMarginClasses: projections.safetyMarginClasses,
                    isCritical: projections.isCritical,
                    message:
                        remainingDays === 0
                            ? "No remaining classes left to improve or reduce your attendance this month."
                            : projections.isCritical
                            ? `Attention: Even with 100% attendance, your maximum possible reach is ${projections.maxPossiblePercent}%.`
                            : projections.safetyMarginClasses === 0
                            ? "You cannot miss any more working days if you want to maintain 75% attendance."
                            : `You can afford to miss ${projections.safetyMarginClasses} more working day(s) and still maintain 75%.`
                }
            }
        });
    } catch (err) {
        console.error("Error while fetching overall attendance report:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
};

export const getYearlyAttendanceReport = async (req, res) => {
    try {
        const { year } = req.body;
        const { userId } = req.user;

        if (!year) {
            return res.json({
                success: false,
                message: "year is missing!"
            });
        }

        const { rows } = await turso.execute(
            `
            WITH daily_sections AS (
            SELECT
            ad.studentId,
            a.date,
            strftime('%m', a.date) AS month,

            COUNT(DISTINCT CASE
            WHEN a.hour IN ('First','Second','Third') THEN a.hour END
            ) AS first_total,

            COUNT(DISTINCT CASE
            WHEN a.hour IN ('Fourth','Fifth') THEN a.hour END
            ) AS second_total,

            SUM(CASE
            WHEN a.hour IN ('First','Second','Third')
            AND ad.status IN ('present','late') THEN 1 ELSE 0 END
            ) AS first_present,

            SUM(CASE
            WHEN a.hour IN ('Fourth','Fifth')
            AND ad.status IN ('present','late') THEN 1 ELSE 0 END
            ) AS second_present

            FROM attendance a
            JOIN attendance_details ad
            ON ad.attendanceId = a.attendanceId

            WHERE ad.studentId = ?
            AND strftime('%Y', a.date) = ?

            GROUP BY ad.studentId, a.date
            ),

            daily_attendance AS (
            SELECT
            studentId,
            month,
            CASE
            WHEN first_total > 0 AND second_total > 0 THEN
            CASE
            WHEN first_present = first_total
            AND second_present = second_total THEN 1.0
            WHEN first_present = 0
            AND second_present = 0 THEN 0.0
            ELSE 0.5
            END

            WHEN first_total > 0 AND second_total = 0 THEN
            CASE
            WHEN first_present = first_total THEN 1.0
            WHEN first_present = 0 THEN 0.0
            ELSE 0.5
            END

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
            month,
            COUNT(attendance_value) AS value,
            ROUND(
            (SUM(attendance_value) * 100.0) / COUNT(attendance_value),
            2
            ) AS percentage
            FROM daily_attendance
            GROUP BY month
            ORDER BY month;
            `,
            [userId, year.toString()]
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
