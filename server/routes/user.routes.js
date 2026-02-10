import express from "express";

import {
    addNotificationToken,
    getUserNotifications
} from "../controllers/users/notification.controller.js";

const router = express.Router();

router.post("/addNotificationToken", addNotificationToken);

router.post("/getUserNotifications", getUserNotifications);

export default router;
