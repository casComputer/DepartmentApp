import express, { json } from "express";
import { turso } from "../config/turso.js";

const router = express.Router();

import {
    save,
    getAttandanceTakenByTeacher,
    fetchStudentsForAttendance,
    getClassAttendance
} from "../controllers/teacher/attendance.controller.js";

router.post("/save", save);

router.post("/getAttandanceTakenByTeacher", getAttandanceTakenByTeacher);

router.post("/fetchStudentsForAttendance", fetchStudentsForAttendance);

router.post("/getClassAttendance", getClassAttendance);

export default router;
