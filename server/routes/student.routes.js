import express from "express";

import { turso } from "../config/turso.js";

import { cancelStudentVerification, fetchStudentsByClass, fetchStudentsByClassTeacher, saveStudentDetails, verifyStudent } from "../controllers/student/students.controller.js"

const router = express.Router();

router.post("/fetchStudentsByClass", fetchStudentsByClass);

router.post("/fetchStudentsByClassTeacher", fetchStudentsByClassTeacher);

router.post('/verifyStudent', verifyStudent);

router.post('/cancelStudentVerification', cancelStudentVerification);

router.post('/saveStudentDetails', saveStudentDetails)



export default router;
