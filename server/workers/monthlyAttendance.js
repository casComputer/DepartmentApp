import { parentPort } from "worker_threads";
import { turso } from "../config/turso.js";

(async () => {
<<<<<<< HEAD
    try {
        // getting start and end of month
        const now = new Date();
        const startDate = now.toISOString().slice(0, 7) + "-01";

        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            .toISOString()
            .slice(0, 10);

        console.log("Date Range:", startDate, "to", endDate);

        const { rows: studentsReport } = await turso.execute(
            `
            SELECT
                s.studentId,
                s.fullname,
                s.course,
                s.year_of_study,
        
            COUNT(CASE WHEN ad.status = 'present' THEN 1 END) AS total_present,
            COUNT(CASE WHEN ad.status = 'absent' THEN 1 END) AS total_absent,
            COUNT(CASE WHEN ad.status = 'late' THEN 1 END) AS total_late,
            COUNT(a.attendanceId) AS total_hours,
            COUNT(DISTINCT a.date) AS total_days
            
            FROM students s
        
            LEFT JOIN attendance_details ad
                ON ad.studentId = s.studentId
        
            LEFT JOIN attendance a
                ON a.attendanceId = ad.attendanceId
                AND a.date BETWEEN ? AND ?    
            
            GROUP BY s.studentId
            ORDER BY s.studentId ASC;
        `,
            [startDate, endDate]
        );

        const {
            workingDays: approximateWorkingDays,
            totalHours: approximateWorkingHours
        } = getWorkingHoursThisMonth();

        const report = {
            approximateWorkingHours,
            approximateWorkingDays,
            studentsReport
        };

        console.log(report);

        parentPort?.postMessage("done");
    } catch (err) {
        console.error("Worker error:", err);
    }
})();
=======
  try {
    // ---- Get current month date range ----
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth() + 1; // JS months = 0–11

    const mm = String(month).padStart(2, "0");
    const startDate = `${year}-${mm}-01`;

    // For report up to today's date
    const dd = String(now.getDate()).padStart(2, "0");
    const endDate = `${year}-${mm}-${dd}`;

    console.log("Date Range:", startDate, "to", endDate);

    // ---- SQL Query using date range ----
    const { rows } = await turso.execute(
      `
      SELECT 
        s.studentId,
        s.fullname,
        s.course,
        s.year_of_study,

        a.date,
        a.hour,
        ad.status,
        a.teacherId

      FROM students s

      LEFT JOIN attendance_details ad 
        ON s.studentId = ad.studentId

      LEFT JOIN attendance a 
        ON ad.attendanceId = a.attendanceId
       AND a.date BETWEEN ? AND ?

      ORDER BY s.studentId ASC, a.date ASC, a.hour ASC;
    `,
      [startDate, endDate] // <-- required params
    );

    console.log("Fetched rows:", rows.length);
    console.log(rows);

    console.log("Monthly calculation finished");

    parentPort?.postMessage("done");
  } catch (err) {
    console.error("Worker error:", err);
  }
})();

>>>>>>> 2875ce16a698865154b56e9df774e8524ee8db4d
