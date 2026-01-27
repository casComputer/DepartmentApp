import express from "express";

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
    saveExamResultDetails,
    checkExamResultUpload
} from '../controllers/student/exam.controller.js'

import {
    verifyStudent,
    verifyMultipleStudents,
    cancelStudentVerification
} from "../controllers/student/verification.controller.js";

import {
    getInternalMarks
} from "../controllers/student/internal.controller.js";

import { authorize } from "../middleware/authentication.middleware.js";

const router = express.Router();

router.post("/fetchStudentsByClass", authorize("teacher", "admin"), fetchStudentsByClass);

router.post("/fetchStudentsByClassTeacher", authorize("teacher", "admin"), fetchStudentsByClassTeacher);

router.post("/verifyStudent", authorize("teacher", "admin"), verifyStudent);

router.post("/cancelStudentVerification", authorize("teacher", "admin"), cancelStudentVerification);

router.post("/saveStudentDetails", authorize("teacher", "admin"), saveStudentDetails);

router.post("/verifyMultipleStudents", authorize("teacher", "admin"), verifyMultipleStudents);

router.post("/autoAssignRollNoAlphabetically", authorize("teacher", "admin"), autoAssignRollNoAlphabetically);

router.post("/assignGroupedRollNo", authorize("teacher", "admin"), assignGroupedRollNo);

router.post("/saveExamResultDetails", saveExamResultDetails);

router.post("/checkExamResultUpload", authorize("teacher", "admin"), checkExamResultUpload);

router.post("/getInternalMarks", authorize("student"), getInternalMarks);

export default router;
