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
    saveExamResultDetails
} from '@controller/student/exam.controller.js'

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

router.post("/saveExamResultDetails", saveExamResultDetails);

export default router;
