import express from "express";

import { turso } from "../config/turso.js";
import { cancelStudentVerification, fetchStudentsByClass, fetchStudentsByClassTeacher, saveStudentDetails, verifyStudent, verifyMultipleStudents, autoAssignRollNoAlphabetically, assignRollNo } from "../controllers/student/students.controller.js"

const router = express.Router();

router.post("/fetchStudentsByClass", fetchStudentsByClass);

router.post("/fetchStudentsByClassTeacher", fetchStudentsByClassTeacher);

router.post("/verifyStudent", verifyStudent);

router.post("/cancelStudentVerification", cancelStudentVerification);

router.post("/saveStudentDetails", saveStudentDetails);

router.post("/verifyMultipleStudents", verifyMultipleStudents);

router.post("/autoAssignRollNoAlphabetically", autoAssignRollNoAlphabetically );

router.post("/assignRollNo", assignRollNo );

export default router;
