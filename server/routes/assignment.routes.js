import express from "express";

import Assignment from "../models/assignment.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { topic, description, year, course, dueDate, teacherId } = req.body;

    if (!topic || !description || !year || !course || !dueDate || !teacherId) {
      return res.json({ message: "All fields are required", success: false });
    }

    await Assignment.create({
      topic,
      description,
      year,
      course,
      dueDate,
      teacherId,
    });

    res
      .status(200)
      .json({ message: "Assignment created successfully", success: true });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

router.post("/getAssignmentsCreatedByMe", async (req, res) => {
  try {
    const { teacherId, page = 1, limit = 10 } = req.body;

    if (!teacherId) {
      return res.json({
        message: "teacherId is required",
        success: false,
      });
    }

    const assignments = await Assignment.find({ teacherId })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const hasMore = assignments.length === limit;
    const nextPage = hasMore ? page + 1 : null;

    res.status(200).json({ assignments, success: true, hasMore, nextPage });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

router.post("/getAssignmentForStudent", async (req, res) => {
  try {
    const { course, year_of_study, studentId, page = 1, limit = 10 } = req.body;

    if (!course || !year_of_study || !studentId) {
      return res.json({
        message: "course, year_of_study and studentId are required",
        success: false,
      });
    }

    const assignments = await Assignment.find({
      course,
      year: year_of_study,
    })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const hasMore = assignments.length === limit;
    const nextPage = hasMore ? page + 1 : null;

    res.status(200).json({ assignments, success: true, hasMore, nextPage });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

export default router;
