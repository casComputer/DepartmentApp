import express from "express";

import { turso } from "../config/turso.js";

import { cancelStudentVerification, fetchStudentsByClass, fetchStudentsByClassTeacher, saveStudentDetails, verifyStudent } from "../controllers/student/students.controller.js"

const router = express.Router();

router.post("/fetchStudentsByClass", fetchStudentsByClass);

router.post("/fetchStudentsByClassTeacher", fetchStudentsByClassTeacher);

router.post('/verifyStudent', verifyStudent);

router.post('/cancelStudentVerification', cancelStudentVerification);

router.post('/saveStudentDetails', saveStudentDetails)

router.post('/verifyMultipleStudents', async (req, res) => {
    try {
        const { students } = req.body;

        if (!Array.isArray(students) || students.length === 0) 
            return res.status(400).json({ error: "students must be a non-empty array" });
        
        // Build placeholders: (?, ?, ?, ...)
        const placeholders = students.map(() => '?').join(',');

        const query = `
            UPDATE students 
            SET is_verified = true 
            WHERE studentId IN (${placeholders})
        `;

        await turso.execute(query, students);

        res.json({ success: true, message: 'students verified' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});


export default router;
