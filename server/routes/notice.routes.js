import express from "express";

import {
    createNotice,
    deleteNotice,
    getAdminNotices
} from "../controllers/admin/notice.controller.js";
import { getUserNotices } from "../controllers/users/notice.controller.js";
import { authorize } from "../middleware/authentication.middleware.js";

const router = express.Router();

// Admin-only routes
router.post("/create", authorize("admin"), createNotice);
router.post("/delete", authorize("admin"), deleteNotice);
router.post("/admin/list", authorize("admin"), getAdminNotices);

// All authenticated users
router.post("/list", getUserNotices);

export default router;
