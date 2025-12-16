import express from "express";

import cloudinary from "../config/cloudinary.js";

const router = express.Router();

export const getSignature = (req, res) => {
    const { preset_type } = req.body;

    if (!preset_type)
        return res.json({ success: false, message: "missing preset type!" });

    const timestamp = Math.round(new Date().getTime() / 1000);

    let preset = null;

    if (preset_type === "notes") {
        preset = "notes_upload";
    } else if (preset_type === "assignment") preset = "assignment_upload";

    if (!preset)
        return res.json({ success: false, message: "invalid preset type!" });

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp,
            upload_preset: preset
        },
        cloudinary.config().api_secret
    );

    res.json({
        timestamp,
        signature,
        api_key: cloudinary.config().api_key
    });
};

router.post("/getSignature", getSignature);
