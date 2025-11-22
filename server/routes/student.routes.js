import express from "express";

import { turso } from "../config/turso.js";
import { validateCourseAndYear } from "../utils/validateCourseAndYear.js";

import { fetchStudentsByClass, fetchStudentsByClassTeacher } from "../controllers/student/students.controller.js"

const router = express.Router();

router.post("/fetchStudentsByClass", fetchStudentsByClass);

router.post("/fetchStudentsByClassTeacher", fetchStudentsByClassTeacher);

router.post('/verifyStudent', async (req, res) => {
    const { studentId } = req.body;
    
    console.log(studentId)

    try {
        await turso.execute(
           'UPDATE students SET is_verified = true WHERE studentId = ?',
           [studentId]
        );

        res.json({ success: true, message: "Student verified" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

router.post('/cancelStudentVerification', async (req, res) => {
    const { studentId } = req.body;
    
    console.log(studentId)

    try {
         await turso.execute(
            'DELETE FROM students WHERE studentId = ?',
            [studentId]
         );

        res.json({ success: true, message: "Student deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

router.post('/saveStudentDetails', (req, res)=> {
	
	try{
		const { studentId, rollno } = req.body
		
		await turso.execute(`
			update students set rollno = ? where studentId = ?
		`, [rollno, studentId])
		
		res.json({
			success: true,
			message: 'Student details saved successfully'
		})
		
		
	}catch(err){
		console.error("Error while saving student details")
		res.status(500).json({ message: "Internal Error: while saving student details", success: false })
	}

	

})



export default router;
