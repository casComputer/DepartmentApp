import express, { json } from "express";

import { authorize } from "../middleware/authentication.middleware.js";

import { authorize} from "../utils/auth.utils.js"

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

import { generateAttendanceReport } from "../controllers/common/attendance.controller.js";

<<<<<<< HEAD
router.post("/save", authorize("teacher", "admin"), save);

router.post(
    "/getAttandanceTakenByTeacher",
    authorize("teacher", "admin"),
    getAttandanceTakenByTeacher,
);

router.post(
    "/fetchStudentsForAttendance",
    authorize("teacher", "admin"),
    fetchStudentsForAttendance,
);
=======
router.post("/save", authorize('teacher', 'admin'), save);

router.post("/getAttandanceTakenByTeacher", authorize('teacher', 'admin'),getAttandanceTakenByTeacher);

router.post("/fetchStudentsForAttendance", authorize('teacher', 'admin'), fetchStudentsForAttendance);
>>>>>>> 8f6fbfb7337e0f68e250856d66f4750fa1968377

router.post(
    "/getClassAttendance",
    authorize("teacher", "admin"),
    getClassAttendance,
);

router.post(
    "/getTodaysAttendanceReport",
    authorize("student"),
    getTodaysAttendanceReport,
);

router.post(
    "/overallAttendenceReport",
    authorize("student"),
    overallAttendenceReport,
);

router.post(
    "/generateAttendanceCalendarReport",
    authorize("student"),
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
