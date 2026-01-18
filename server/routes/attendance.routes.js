import express, { json } from "express";
import { turso } from "../config/turso.js";

const router = express.Router();

import {
    save,
    getAttandanceTakenByTeacher,
    fetchStudentsForAttendance,
    getClassAttendance
} from "../controllers/teacher/attendance.controller.js";

import {
    generateAttendanceCalendarReport,
    getTodaysAttendanceReport,
    getMonthlyAttendanceMiniReport,
    getYearlyAttendanceReport
} from "../controllers/student/attendance.controller.js";

router.post("/save", save);

router.post("/getAttandanceTakenByTeacher", getAttandanceTakenByTeacher);

router.post("/fetchStudentsForAttendance", fetchStudentsForAttendance);

router.post("/getClassAttendance", getClassAttendance);

router.post("/getTodaysAttendanceReport", getTodaysAttendanceReport);

router.post("/getMonthlyAttendanceMiniReport", getMonthlyAttendanceMiniReport);

router.post(
    "/generateAttendanceCalendarReport",
    generateAttendanceCalendarReport
);

router.post("/getYearlyAttendanceReport", getYearlyAttendanceReport);

export default router;
