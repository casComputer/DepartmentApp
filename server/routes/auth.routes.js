import express from "express";
import { turso } from "../config/turso.js";

const router = express.Router();

import signupController from "../controllers/auth/signup.controller.js";
import signinController from "../controllers/auth/signin.controller.js";
import { refreshAccessToken } from "../controllers/auth/refresh.controller.js";
import logoutController from "../controllers/auth/logout.controller.js";

router.post("/signin", signinController);

router.post("/signup", signupController);

router.post("/refresh", refreshAccessToken);

router.post("/logout", logoutController);

router.get("/users", async (req, res) => {
<<<<<<< HEAD
    try {
        const students = await turso.execute(`SELECT * FROM students`);
        const teachers = await turso.execute(`SELECT * FROM teachers`);
        const admins = await turso.execute(`SELECT * FROM admins`);
        const result = {
            students: students.rows,
            teachers: teachers.rows,
            admins: admins.rows
        };
        res.send(result);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/get", async (req, res) => {
    try {
        const { rows } = await turso.execute(
            "SELECT * FROM attendance ORDER BY date DESC"
        );
        if (rows.length === 0) {
            return res.status(404).json({
                message: "No attendance records found",
                success: false
            });
        }

        res.send(rows);
    } catch (err) {
        console.log("Error while fetching attendence: ", err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
});

router.get("/report", async (req, res) => {
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

    
    res.send(report);
=======
	try {
		const students = await turso.execute(`SELECT * FROM students`);
		const teachers = await turso.execute(`SELECT * FROM teachers`);
		const admins = await turso.execute(`SELECT * FROM admins`);
		const result = {
			students: students.rows,
			teachers: teachers.rows,
			admins: admins.rows,
		};
		res.send(result);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ error: "Internal server error" });
	}
>>>>>>> 2875ce16a698865154b56e9df774e8524ee8db4d
});

router.get("/get", async (req, res) => {
	try {
		const { rows } = await turso.execute(
			"SELECT * FROM attendance ORDER BY date DESC"
		);
		if (rows.length === 0) {
			return res
				.status(404)
				.json({
					message: "No attendance records found",
					success: false,
				});
		}

		res.send(rows);
	} catch (err) {
		console.log("Error while fetching attendence: ", err);
		res.status(500).json({
			message: "Internal server error",
			success: false,
		});
	}
});   

router.get("/report", async(req, res) =>{
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

    res.send(rows);
})

export default router;
