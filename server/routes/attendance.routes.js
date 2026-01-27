import express, {
    json
} from "express";
import {
    turso
} from "../config/turso.js";

import { authorize} from "../utils/auth.utils.js"

const router = express.Router();

import {
    save,
    getAttandanceTakenByTeacher,
    fetchStudentsForAttendance,
    getClassAttendance,
    generateXlSheet
} from "../controllers/teacher/attendance.controller.js";

import {
    generateAttendanceCalendarReport,
    getTodaysAttendanceReport,
    overallAttendenceReport,
    getYearlyAttendanceReport
} from "../controllers/student/attendance.controller.js";

import {
    generateAttendanceReport
} from "../controllers/common/attendance.controller.js";

router.post("/save", authorize('teacher', 'admin'), save);

router.post("/getAttandanceTakenByTeacher", authorize('teacher', 'admin'),getAttandanceTakenByTeacher);

router.post("/fetchStudentsForAttendance", authorize('teacher', 'admin'), fetchStudentsForAttendance);

router.post("/getClassAttendance", getClassAttendance);

router.post("/getTodaysAttendanceReport", getTodaysAttendanceReport);

router.post("/overallAttendenceReport", overallAttendenceReport);

router.post(
    "/generateAttendanceCalendarReport",
    generateAttendanceCalendarReport
);

router.post("/getYearlyAttendanceReport", getYearlyAttendanceReport);

router.post("/monthlyReport", generateAttendanceReport);

router.post("/monthly-report/excel", generateXlSheet);

export default router;