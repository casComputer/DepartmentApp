import express from "express";
import crypto from "crypto";

import cloudinary from "../config/cloudinary.js";
import Assignment from "../models/assignment.js";

import {
    createAssignment,
    getAssignmentsCreatedByMe
} from "../controllers/teacher/assignment.controller.js";
import { getAssignmentForStudent } from "../controllers/student/assignment.controller.js";

const router = express.Router();

export const getSignature = (req, res) => {
    const timestamp = Math.round(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp,
            upload_preset: "assignment_upload"
        },
        cloudinary.config().api_secret
    );

    res.json({
        timestamp,
        signature,
        api_key: cloudinary.config().api_key
    });
};
router.post("/create", createAssignment);

router.post("/getAssignmentsCreatedByMe", getAssignmentsCreatedByMe);

router.post("/getAssignmentForStudent", getAssignmentForStudent);

router.get("/getSignature", getSignature);

export default router;
