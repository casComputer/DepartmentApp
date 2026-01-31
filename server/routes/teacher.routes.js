import express from "express";

const router = express.Router();

import {
    saveWorklog,
    getWorklogs
} from "../controllers/teacher/worklog.controller.js";
import { addCourse } from "../controllers/teacher/course.controller.js";
import {
    syncUser,
    fetchAllTeachers
} from "../controllers/teacher/teacher.controller.js";
import { fetchExamResult } from "../controllers/teacher/exam.controller.js";
import {
    saveInternalMarkDetails,
    checkInternalMarkUpload,
    getInternalMarkHistory
} from "../controllers/teacher/internal.controller.js";
import {
    fetchParents,
    verifyParent,
    removeParent
} from "../controllers/teacher/parent.controller.js";

import { authorize } from "../middleware/authentication.middleware.js";

router.post("/saveWorklog", authorize("teacher", "admin"), saveWorklog);

router.post("/getWorklogs", authorize("teacher", "admin"), getWorklogs);

router.get("/sync", authorize("teacher", "admin"), syncUser);

router.post("/addCourse", authorize("teacher", "admin"), addCourse);

router.post("/fetchAllTeachers", fetchAllTeachers);

router.post("/fetchExamResult", authorize("teacher", "admin"), fetchExamResult);

router.post(
    "/saveInternalMarkDetails",
    authorize("teacher", "admin"),
    saveInternalMarkDetails
);

router.post(
    "/checkInternalMarkUpload",
    authorize("teacher", "admin"),
    checkInternalMarkUpload
);

router.post(
    "/getInternalMarkHistory",
    authorize("teacher", "admin"),
    getInternalMarkHistory
);

router.post("/fetchParents", authorize("teacher", "admin"), fetchParents);

router.post("/verifyParent", authorize("teacher", "admin"), verifyParent);
router.post("/removeParent", authorize("teacher", "admin"), removeParent);

export default router;
