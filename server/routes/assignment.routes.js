import express from "express";

import cloudinary from "../config/cloudinary.js";

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

router.post("/create", createAssignment);

router.post("/getAssignmentsCreatedByMe", getAssignmentsCreatedByMe);

router.post("/getAssignmentForStudent", getAssignmentForStudent);

router.post(
    "/saveAssignmentSubmissionDetails",
    saveAssignmentSubmissionDetails
);

router.post("/reject", reject);

router.post("/accept", accept);

export default router;
