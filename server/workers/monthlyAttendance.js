import { parentPort } from "worker_threads";
import { turso } from "../config/turso.js";

(async () => {
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

