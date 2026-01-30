import express from "express";

import {
    authorize
} from "../middleware/authentication.middleware.js";

const router = express.Router();

import {
    save,
    getAttandanceTakenByTeacher,
    fetchStudentsForAttendance,
    getClassAttendance,
    generateXlSheet,
} from "../controllers/teacher/attendance.controller.js";
import {
    generateAttendanceCalendarReport,
    getTodaysAttendanceReport,
    overallAttendenceReport,
    getYearlyAttendanceReport,
} from "../controllers/student/attendance.controller.js";

import {
    generateAttendanceReport
} from "../controllers/common/attendance.controller.js";

router.post("/save", authorize('teacher', 'admin'), save);

router.post("/getAttandanceTakenByTeacher", authorize('teacher', 'admin'), getAttandanceTakenByTeacher);

router.post("/fetchStudentsForAttendance", authorize('teacher', 'admin'), fetchStudentsForAttendance);

router.post(
    "/getClassAttendance",
    authorize("teacher", "admin"),
    getClassAttendance,
);

router.post(
    "/getTodaysAttendanceReport",
    authorize("student", "parent"),
    getTodaysAttendanceReport,
);

router.post(
    "/overallAttendenceReport",
    authorize("student", "parent"),
    overallAttendenceReport,
);

router.post(
    "/generateAttendanceCalendarReport",
    authorize("student", "parent"),
    generateAttendanceCalendarReport,
);

router.post(
    "/getYearlyAttendanceReport",
    authorize("student"),
    getYearlyAttendanceReport,
);

router.post("/monthlyReport", generateAttendanceReport);

router.post("/monthly-report/excel", generateXlSheet);

export default router;