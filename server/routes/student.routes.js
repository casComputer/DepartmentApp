import express from "express";

import {
    fetchStudentsByClass,
    fetchStudentsByClassTeacher,
    saveStudentDetails,
} from "../controllers/student/students.controller.js";

import {
    autoAssignRollNoAlphabetically,
    assignGroupedRollNo,
} from "../controllers/student/rollno.controller.js";

import {
    saveExamResultDetails,
    checkExamResultUpload,
} from "../controllers/student/exam.controller.js";

import {
    verifyStudent,
    verifyMultipleStudents,
    cancelStudentVerification,
    removeAllByClassTeacher,
} from "../controllers/student/verification.controller.js";

import { getInternalMarks } from "../controllers/student/internal.controller.js";

import { authorize } from "../middleware/authentication.middleware.js";
import { turso } from "../config/turso.js";

const router = express.Router();

router.post("/fetchStudentsByClass", fetchStudentsByClass);

router.get(
    "/fetchStudentsByClassTeacher",
    authorize("teacher", "admin"),
    fetchStudentsByClassTeacher,
);

router.post("/verifyStudent", authorize("teacher", "admin"), verifyStudent);

router.post(
    "/cancelStudentVerification",
    authorize("teacher", "admin"),
    cancelStudentVerification,
);

router.post(
    "/saveStudentDetails",
    authorize("teacher", "admin"),
    saveStudentDetails,
);

router.post(
    "/verifyMultipleStudents",
    authorize("teacher", "admin"),
    verifyMultipleStudents,
);

router.post(
    "/autoAssignRollNoAlphabetically",
    authorize("teacher", "admin"),
    autoAssignRollNoAlphabetically,
);

router.post(
    "/assignGroupedRollNo",
    authorize("teacher", "admin"),
    assignGroupedRollNo,
);

router.post(
    "/removeAllByClassTeacher",
    authorize("teacher", "admin"),
    removeAllByClassTeacher,
);

router.post("/saveExamResultDetails", saveExamResultDetails);

router.post(
    "/checkExamResultUpload",
    authorize("student"),
    checkExamResultUpload,
);

router.post("/getInternalMarks", authorize("student"), getInternalMarks);

router.get("/sync", authorize("student"), async (req, res) => {
    try {
        const { userId } = req.user;
        const { rows } = await turso.execute(`
            SELECT
                s.is_verified, s.rollno, s.course, s.year from users u join students s on u.userId = s.userId
            WHERE id = '${userId}'
        `);

        if (rows.length > 0) {
            const data = rows[0];
            res.json({
                success: true,
                message: "User data synced successfully",
                is_verified: data.is_verified,
                rollno: data.rollno,
                course: data.course,
                year: data.year,
            });
        } else {
            res.json({
                success: false,
                message: "User data not found",
                type: "NOT_FOUND",
                is_verified: false,
            });
        }
    } catch (error) {
        console.error("Error syncing user data: ", error);
        res.status(500).json({
            success: false,
            message: "Failed to sync user data",
            is_verified: false,
        });
    }
});

export default router;
