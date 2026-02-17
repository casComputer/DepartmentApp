import express from "express";

import {
    getTeachers,
    assignClass,
    verifyTeacher,
    deleteTeacher
} from "../controllers/admin/teachers.controller.js";

import { clearTable } from "../controllers/admin/table.controller.js"

const router = express.Router();

router.get("/teachers", getTeachers);

router.post("/assignClass", assignClass);

router.post("/verifyTeacher", verifyTeacher);

router.post("/deleteTeacher", deleteTeacher);

router.post('/clearTable', clearTable)

export default router;
