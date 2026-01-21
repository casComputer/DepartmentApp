import express, {
    json
} from "express";
import {
    turso
} from "../config/turso.js";

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

router.post("/save", save);

router.post("/getAttandanceTakenByTeacher", getAttandanceTakenByTeacher);

router.post("/fetchStudentsForAttendance", fetchStudentsForAttendance);

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