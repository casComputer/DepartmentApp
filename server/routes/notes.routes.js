import express from "express";

import { create, fetchByTeacher, upload, deleteNote } from "../controllers/teacher/notes.controller.js";
import { fetchByStudent } from "../controllers/student/notes.controller.js";
import { authorize } from "../middleware/authentication.middleware.js";

const router = express.Router();

router.post("/fetchByTeacher", authorize("teacher", "admin"),  fetchByTeacher);

router.post("/create", authorize("teacher", "admin"), create);

router.post("/upload", authorize("teacher", "admin"), upload);


router.post("/delete", authorize("teacher", "admin"), deleteNote);

// student routes

router.post("/fetchByStudent", authorize("student"), fetchByStudent);

export default router;
