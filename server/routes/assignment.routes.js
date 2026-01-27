import express from "express";

import cloudinary from "../config/cloudinary.js";
import { authorize } from "../middleware/authentication.middleware.js";

import {
    createAssignment,
    getAssignmentsCreatedByMe,
    reject,
    accept
} from "../controllers/teacher/assignment.controller.js";
import {
    getAssignmentForStudent,
    saveAssignmentSubmissionDetails
} from "../controllers/student/assignment.controller.js";

const router = express.Router();

router.post("/create", authorize('teacher', 'admin'), createAssignment);

router.post("/getAssignmentsCreatedByMe",authorize('teacher', 'admin'),  getAssignmentsCreatedByMe);

router.post("/getAssignmentForStudent",authorize('student'),  getAssignmentForStudent);

router.post(
    "/saveAssignmentSubmissionDetails",
    authorize('student'), 
    saveAssignmentSubmissionDetails
);

router.post("/reject", authorize('teacher', 'admin'), reject);

router.post("/accept", authorize('teacher', 'admin'),  accept);

export default router;
