import express from "express";

import cloudinary from "../config/cloudinary.js";
import { tursoStats } from "../config/turso.js";

const router = express.Router();

router.get("/cloudinary", async (req, res) => {
    try {
        const usage = await cloudinary.api.usage();
    
        res.json({
            success: true,
            usage
        });
    } catch (error) {
        console.error("Error while fetching cloudinary stats: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error?.message ?? "Error while fetching cloudinary stats!"
        });
    }
});

router.get("/turso", async (req, res) => {
    try {
        const usageStatsWithDate = await tursoStats.databases.usage("database");

        res.json({
            success: true,
            stats: usageStatsWithDate
        });
    } catch (error) {
        console.error("Error while fetching turso stats: ", error);
        res.json({
            success: false,
            message: "Failed to fetch turso status!",
            error: error?.message ?? "Failed to fetch turso status"
        });
    }
});

export default router;
