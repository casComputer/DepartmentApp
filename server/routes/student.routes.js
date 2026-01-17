import express from "express";

import { turso } from "../config/turso.js";

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

import {
    generateAttendanceCalendarReport,
    getTodaysAttendanceReport,
    getMonthlyAttendanceMiniReport
} from "../controllers/student/attendance.controller.js";

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

router.post("/getTodaysAttendanceReport", getTodaysAttendanceReport);

router.post("/getMonthlyAttendanceMiniReport", getMonthlyAttendanceMiniReport);

router.post(
    "/generateAttendanceCalendarReport",
    generateAttendanceCalendarReport
);

router.post("/getYearlyAttendanceReport", async (req, res) => {
    try {
        const { year } = req.body;
        const { userId } = req.user;

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
            AND strftime('%Y', a.date) = ?
        `,
            [userId, year]
        );

        let report = rows.map(item => ({
            date: item.date,
            status: item.status
        }));

        res.json({
            success: true,
            report,
            rows
        });
    } catch (err) {
        console.error("Error while fetching yearly attendance report: ", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
});

export default router;
