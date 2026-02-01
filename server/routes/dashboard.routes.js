import express from "express";

import cloudinary from "../config/cloudinary.js"

const router = express.Router();

router.get("/cloudinary", async (req, res) => {
    try {
        const usage = await cloudinary.api.usage();

        const folders = await cloudinary.api.root_folders();

        const images = await cloudinary.api.resources({
            resource_type: "image",
            max_results: 1
        });

        const videos = await cloudinary.api.resources({
            resource_type: "video",
            max_results: 1
        });

        res.json({
            success: true,
            usage,
            folders,
            images,
            videos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            mes: "Internal Server Error!"
        });
    }
});

export default router;
