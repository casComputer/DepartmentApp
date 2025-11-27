import express from "express";

import { turso } from "../config/turso.js";

import { fetchStudentsByClass, fetchStudentsByClassTeacher, saveStudentDetails,  } from "../controllers/student/students.controller.js"
import { autoAssignRollNoAlphabetically, assignGroupedRollNo } from "../controllers/student/rollno.controller.js"
import { verifyStudent, verifyMultipleStudents, cancelStudentVerification } from "../controllers/student/verification.controller.js"

const router = express.Router();

router.post("/fetchStudentsByClass", fetchStudentsByClass);

router.post("/fetchStudentsByClassTeacher", fetchStudentsByClassTeacher);

router.post("/verifyStudent", verifyStudent);

router.post("/cancelStudentVerification", cancelStudentVerification);

router.post("/saveStudentDetails", saveStudentDetails);

router.post("/verifyMultipleStudents", verifyMultipleStudents);

router.post("/autoAssignRollNoAlphabetically", autoAssignRollNoAlphabetically );

router.post("/assignGroupedRollNo", assignGroupedRollNo );

// actual student routes that are accessed by students

router.post("/getTodaysAttendanceReport", async(req, res)=>{
	try{
		const { userId } = req.body
		
		
		const today = new Date();

		const date = today.toISOString().slice(0, 10)
		
		/*
			const day = today.getDate();
			const weekday = today.toLocaleString('en-US', { weekday: 'long' }); 
			const month = today.toLocaleString('en-US', { month: 'long' });
			const year = today.getFullYear();
		*/
		
		const { rows } = await turso.execute(`
			SELECT *
				FROM attendance a
				JOIN students s
					ON s.year_of_study = a.year
					AND s.course = a.course
				
				JOIN attendance_details ad
					ON ad.attendanceId = a.attendanceId
					AND ad.studentId = s.studentId


			WHERE s.studentId = ?
			AND a.date = ?
		`,[userId, date]
		);

		let attendance = rows.reduce((acc, item) => {
			acc[item.hour] = item.status;
			return acc;
		}, {});

		res.json({
			attendance, success: true
		})

		
	} catch(err){
		console.error("Error while getting daily attendance report: ", err)
		res.json({ mesage:  "internal server error" , success: false })
	}
})

    
    
    
   


export default router;
