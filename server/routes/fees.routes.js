import express from "express";

import { authorize } from "../middleware/authentication.middleware.js";

import {
    create,
    fetch as fetchByTeacher,
    deleteFee
} from "../controllers/teacher/fees.controller.js";
import { fetch as fetchByStudent } from "../controllers/student/fees.controller.js";

const router = express.Router();

router.post("/create", authorize("teacher", "admin"), create);

router.post("/fetchByTeacher", authorize("teacher", "admin"), fetchByTeacher);

router.post("/delete", authorize("teacher", "admin"), deleteFee);

router.post("/fetchByStudent", authorize("student"), fetchByStudent);

export default router;
