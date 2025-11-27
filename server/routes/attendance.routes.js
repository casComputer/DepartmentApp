import express, { json } from "express";
import { turso } from "../config/turso.js";

const router = express.Router();


router.post("/save", async (req, res) => {
     const tx = await turso.transaction('write');

    try {
        const { attendance, course, year, teacherId, hour } = req.body;

        const date = new Date().toISOString().slice(0, 10);
        const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
        
        const present = attendance.filter((r) => r.present);
        const absent = attendance.filter((r) => !r.present);
        
        const pCount = present?.length || 0, aCount = absent?.length || 0
        


        
        // Insert into main attendance table
        const insertAttendance =
            `INSERT INTO attendance (course, year, hour, date, timestamp, teacherId, present_count, absent_count)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const result = await tx.execute({
        	sql: insertAttendance, 
        	args: [ course, year, hour, date, timestamp, teacherId, pCount, aCount]
        });
        
        const attendanceId = result.lastInsertRowid;

        // Insert student status rows into attendance_details
        const insertDetail =
            `INSERT INTO attendance_details (attendanceId, studentId, status)
             VALUES (?, ?, ?)`;
             
        
        for (const s of present) {
            await tx.execute({
            	sql: insertDetail, 
            	args: [attendanceId, s.studentId, "present"]
            });
        }

        for (const s of absent) {
            await tx.execute({
            	sql: insertDetail, 
            	args: [attendanceId, s.studentId, "absent"]
            });
        }

 
        await tx.commit();

        res.status(200).json({
            message: "Attendance saved successfully",
            success: true,
        });

    } catch (err) {
        await tx.rollback();

        if (err.message.includes("UNIQUE constraint")) {
            return res.status(500).json({
                message: "Attendance already taken for this hour",
                success: false,
            });
        }

        console.error("Error while saving attendance:", err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});


router.post("/getAttandanceTakenByTeacher", async (req, res) => {
	try {
		const { teacherId, page = 1, limit = 10 } = req.body;
		const offset = (page - 1) * limit;

		const { rows: attendance } = await turso.execute(
			"SELECT * FROM attendance WHERE teacherId = ? ORDER BY date DESC LIMIT ? OFFSET ?",
			[teacherId, limit, offset]
		);
		
		console.log(attendance)
	
		// extra data for infinite scrolling

		const totalCountResult = await turso.execute(
			"SELECT COUNT(*) as count FROM attendance WHERE teacherId = ?",
			[teacherId]
		);
		const totalCount = totalCountResult.rows[0].count;
		
		console.log("total count")

		const hasMore = page * limit < totalCount;

		console.log('hasmore ', hasMore)

		res.json({
			success: true,
			attendance,
			nextPage: hasMore ? page + 1 : null,
			hasMore,
		});
	} catch (err) {
		console.log("Error while fetching attendence: ", err);
		res.status(500).json({
			message: "Internal server error",
			success: false,
		});
	}
});

router.post("/fetchStudentsForAttendance", async (req, res)=>{
	try{
	
		const { course, year } = req.body;
		
		if(!course || !year) return res.json({ success: false, message: "course or year is miising"})
		
		const { rows } = await turso.execute(
            "SELECT studentId, rollno from students where course = ? and year_of_study = ? and is_verified = true and rollno > 0 ORDER BY rollnO;",
            [course, year]
        );
         
        const numberOfStudents = rows?.length || 0
        
        res.json({ success: true, numberOfStudents, students: rows })
	
	} catch(err){
		res.status(500).json({ message: "insternal server error", success: false})
		console.log("error while fetching students details for attendance: " ,err)
	}
})

		
	



export default router; 
