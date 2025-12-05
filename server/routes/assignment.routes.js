import express from "express";
import crypto from "crypto";

import Assignment from "../models/assignment.js";

import {
    createAssignment,
    getAssignmentsCreatedByMe
} from "../controllers/teacher/assignment.controller.js";
import { getAssignmentForStudent } from "../controllers/student/assignment.controller.js";

const router = express.Router();

export const getSignature = (req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = crypto
        .createHash("sha1")
        .update(
            `timestamp=${timestamp}&upload_preset=assignment_upload${process.env.CLOUDINARY_API_SECRET}`
        )
        .digest("hex");

    const api_key = process.env.CLOUDINARY_API_KEY;

    res.json({ timestamp, signature, api_key });
};

router.post("/create", createAssignment);

router.post("/getAssignmentsCreatedByMe", getAssignmentsCreatedByMe);

router.post("/getAssignmentForStudent");

router.get("/getSignature", getSignature);

export default router;
