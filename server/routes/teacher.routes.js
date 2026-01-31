import express from "express";

const router = express.Router();

import {
    saveWorklog,
    getWorklogs,
} from "../controllers/teacher/worklog.controller.js";
import { addCourse } from "../controllers/teacher/course.controller.js";
import {
    syncUser,
    fetchAllTeachers,
} from "../controllers/teacher/teacher.controller.js";
import { fetchExamResult } from "../controllers/teacher/exam.controller.js";
import {
    saveInternalMarkDetails,
    checkInternalMarkUpload,
    getInternalMarkHistory,
} from "../controllers/teacher/internal.controller.js";

import { authorize } from "../middleware/authentication.middleware.js";

router.post("/saveWorklog", authorize("teacher", "admin"), saveWorklog);

router.post("/getWorklogs", authorize("teacher", "admin"), getWorklogs);

router.get("/sync", authorize("teacher", "admin"), syncUser);

router.post("/addCourse", authorize("teacher", "admin"), addCourse);

router.post("/fetchAllTeachers", fetchAllTeachers);

router.post("/fetchExamResult", authorize("teacher", "admin"), fetchExamResult);

router.get(
    "/saveInternalMarkDetails",
    authorize("teacher", "admin"),
    saveInternalMarkDetails,
);

router.post(
    "/checkInternalMarkUpload",
    authorize("teacher", "admin"),
    checkInternalMarkUpload,
);

router.post(
    "/getInternalMarkHistory",
    authorize("teacher", "admin"),
    getInternalMarkHistory,
);

router.post(
    "/fetchParents",
    authorize("teacher"),
    fetchParents,
);

export default router;
