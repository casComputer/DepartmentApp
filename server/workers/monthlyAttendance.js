import { parentPort } from "worker_threads";
import { turso } from "../config/turso.js";

(async () => {
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
