import express from "express";

import {
    getTeachers,
    assignClass,
    verifyTeacher,
    deleteTeacher,
    removeIncharge
} from "../controllers/admin/teachers.controller.js";

import {
    clearTable,
    clearAllUsers
} from "../controllers/admin/table.controller.js";

const router = express.Router();

router.get("/teachers", getTeachers);

router.post("/assignClass", assignClass);

router.post("/removeIncharge", removeIncharge);

router.post("/verifyTeacher", verifyTeacher);

router.post("/deleteTeacher", deleteTeacher);

router.post("/clearTable", clearTable);

router.post("/clearAllUsers", clearAllUsers);

export default router;
