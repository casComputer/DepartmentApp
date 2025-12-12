import express from "express";

import Assignment from "../../models/assignment.js";
import cloudinary from "../config/cloudinary.js";

import {
    createAssignment,
    getAssignmentsCreatedByMe,
    
} from "../controllers/teacher/assignment.controller.js";
import { getAssignmentForStudent, saveAssignmentSubmissionDetails } from "../controllers/student/assignment.controller.js";

const router = express.Router();

export const getSignature = (req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000);

    console.log(timestamp, cloudinary.config().api_secret);

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

router.post("/saveAssignmentSubmissionDetails", saveAssignmentSubmissionDetails);

router.post("/reject", async(req, res) => {
    try {
        const { assignmentId, studentId } = req.body;

        await Assignment.updateOne(
            { _id: assignmentId },
            { $pull: { submissions: { studentId: studentId } } }
        );

        res.status(200).json({ message: "Assignment submission rejected successfully.", success: true });
    } catch (error) {
        console.error("Error rejecting assignment submission:", error);
        res.status(500).json({ message: "Internal server error.", success: false });
    }
});


export default router;
