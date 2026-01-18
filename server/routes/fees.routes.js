import express from "express";

import { turso } from "../config/turso.js";

import {
    create,
    fetch as fetchByTeacher,
    deleteFee
} from "../controllers/teacher/fees.controller.js";
import { fetch as fetchByStudent } from "../controllers/student/fees.controller.js";

const router = express.Router();

router.post("/create", create);

router.post("/fetchByTeacher", fetchByTeacher);

router.post("/delete", deleteFee);

router.post("/fetchByStudent", fetchByStudent);

export default router;
