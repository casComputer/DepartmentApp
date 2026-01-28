import express from "express";

import cloudinary from "../config/cloudinary.js";

const router = express.Router();

export const getSignature = (req, res) => {
    const { preset_type } = req.body;

    try {
        if (!preset_type)
            return res.json({
                success: false,
                message: "missing preset type!",
            });

        const timestamp = Math.round(new Date().getTime() / 1000);

        let preset = null;

        if (preset_type === "note") preset = "notes_upload";
        else if (preset_type === "assignment") preset = "assignment_upload";
        else if (preset_type === "dp") preset = "dp_upload";
        else if (preset_type === "exam_result") preset = "exam_result_upload";
        else if (preset_type === "internal_mark") preset= "internal_mark_upload";

        if (!preset)
            return res.json({
                success: false,
                message: "invalid preset type!",
            });

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                upload_preset: preset,
            },
            cloudinary.config().api_secret,
        );

        res.json({
            timestamp,
            signature,
            api_key: cloudinary.config().api_key,
            cloud_name: cloudinary.config().cloud_name,
            preset,
        });
    } catch (error) {
        console.error("Error generating signature:", error);
        res.json({ success: false, message: "Failed to generate signature!" });
    }
};

router.post("/getSignature", getSignature);

export default router;
