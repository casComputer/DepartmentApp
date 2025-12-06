import express from "express";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

import Assignment from "../models/assignment.js";

import {
    createAssignment,
    getAssignmentsCreatedByMe
} from "../controllers/teacher/assignment.controller.js";
import { getAssignmentForStudent } from "../controllers/student/assignment.controller.js";

const router = express.Router();

export const getSignature = (req, res) => {
    const timestamp = Math.round(Date.now() / 1000);

    const params = `timestamp=${timestamp}&upload_preset=assignment_upload`;

    const signature = crypto
        .createHash("sha1")
        .update(params + process.env.CLOUDINARY_API_SECRET)
        .digest("hex");

    res.json({
        timestamp,
        signature,
        api_key: process.env.CLOUDINARY_API_KEY
    });
};

router.post("/create", createAssignment);

router.post("/getAssignmentsCreatedByMe", getAssignmentsCreatedByMe);

router.post("/getAssignmentForStudent", getAssignmentForStudent);

router.get("/getSignature", getSignature);

router.get("/signature", async (req, res) => {
    const apiSecret = cloudinary.config().api_secret;

    console.log(apiSecret);

    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp: timestamp,
            folder: "files"
        },
        apiSecret
    );

    res.json({
        timestamp,
        signature,
        api_key: process.env.CLOUDINARY_API_KEY
    });
});

export default router;
