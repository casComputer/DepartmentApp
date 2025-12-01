import express from "express";
import { Worker } from "worker_threads";

import { turso } from "../config/turso.js";
import AttendanceModel from "../models/monthlyAttendanceReport.js";
import { getFirstAndLastDate, getRemainingWorkSummary } from '../utils/workHour.js'

import {
    fetchStudentsByClass,
    fetchStudentsByClassTeacher,
    saveStudentDetails
} from "../controllers/student/students.controller.js";
import {
    autoAssignRollNoAlphabetically,
    assignGroupedRollNo
} from "../controllers/student/rollno.controller.js";
import {
    verifyStudent,
    verifyMultipleStudents,
    cancelStudentVerification
} from "../controllers/student/verification.controller.js";

const router = express.Router();

router.post("/fetchStudentsByClass", fetchStudentsByClass);

router.post("/fetchStudentsByClassTeacher", fetchStudentsByClassTeacher);

router.post("/verifyStudent", verifyStudent);

router.post("/cancelStudentVerification", cancelStudentVerification);

router.post("/saveStudentDetails", saveStudentDetails);

router.post("/verifyMultipleStudents", verifyMultipleStudents);

router.post("/autoAssignRollNoAlphabetically", autoAssignRollNoAlphabetically);

router.post("/assignGroupedRollNo", assignGroupedRollNo);

// actual student routes that are accessed by students

router.post("/getTodaysAttendanceReport", async (req, res) => {
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
            success: true
        });
    } catch (err) {
        console.error("Error while getting daily attendance report: ", err);
        res.json({ mesage: "internal server error", success: false });
    }
});

router.post("/getMonthlyAttendanceMiniReport", async (req, res) => {
    try {
        const { userId } = req.body;
        
        const {first, last} = getFirstAndLastDate()

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
                report: { ...rows[0], workedDays, remainingHours, remainingDays}
            });
        }

        res.json({
            success: false,
            message: "No data available, try again later!",
            report: {
                remainingDays, remainingHours
            }
        });
    } catch (err) {
        console.error("Error while fetching monthly attendance report: ", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
});

export default router;
