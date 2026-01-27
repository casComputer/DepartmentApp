import express from "express";

import { getTeachers, assignClass, verifyTeacher, deleteTeacher } from "../controllers/admin/teachers.controller.js"

const router = express.Router();

router.get("/teachers", getTeachers);

router.post("/assignClass", assignClass)

router.post("/verifyTeacher", verifyTeacher)

router.post("/deleteTeacher", deleteTeacher)

export default router;
