import express from "express";

import {
    cloudinaryStats,
    tursoStats,
    usersStats
} from "../controller/dashboard.controller.js";

const router = express.Router();

router.get("/cloudinary", cloudinaryStats);

router.get("/turso", tursoStats);

router.get("/users", usersStats);

export default router;
