import express from "express";

const router = express.Router();

import { saveWorklog, getWorklogs } from "../controllers/teacher/worklog.controller.js";
import { addCourse } from "../controllers/teacher/course.controller.js";
import { syncUser, fetchAllTeachers } from "../controllers/teacher/teacher.controller.js";

router.post("/saveWorklog", saveWorklog);

router.post("/getWorklogs", getWorklogs);

router.get("/sync", syncUser);

router.post("/addCourse", addCourse);

router.post("/fetchAllTeachers", fetchAllTeachers);

export default router;
