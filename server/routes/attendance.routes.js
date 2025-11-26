import express, { json } from "express";
import { turso } from "../config/turso.js";

const router = express.Router();

router.post("/save", async(req, res) => {

	try{
		const { attendance, course, year, teacherId, hour } = req.body;
        console.log("inserting..")
        console.log(req.body)
		await turso.execute("insert into attendance (course, year, hour, date, timestamp, teacherId) values (?, ?, ? , ?, ?, ?)", ['Bca', year, hour, 'date', 'time', teacherId])
		console.log("inserted")
	} catch(err){
		console.error(err)
	}

})

router.post("/save", async (req, res) => {
     const tx = await turso.transaction(); 
   

    try {
        const { attendance, course, year, teacherId, hour } = req.body;
        
        console.log("REQ BODY:", req.body);

        const date = new Date().toISOString().slice(0, 10);
        const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);

        

        // Insert into main attendance table
        const insertAttendance =
            `INSERT INTO attendance (course, year, hour, date, timestamp, teacherId)
             VALUES (?, ?, ?, ?, ?, ?)`;

        const result = await tx.execute(insertAttendance, [
            'Bca', year, hour, date, timestamp, teacherId
        ]);

        
        const attendanceId = result.lastInsertRowid;

        // Insert student status rows into attendance_details
        const insertDetail =
            `INSERT INTO attendance_details (attendanceId, studentId, status)
             VALUES (?, ?, ?)`;
             
        const present = attendance.filter((r) => r.present);
        const absent = attendance.filter((r) => !r.present);

        for (const s of present) {
            await tx.execute(insertDetail, [attendanceId, s.studentId, "present"]);
        }

        for (const s of absent) {
            await tx.execute(insertDetail, [attendanceId, s.studentId, "absent"]);
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

		const { rows } = await turso.execute(
			"SELECT * FROM attendance WHERE teacherId = ? ORDER BY date DESC LIMIT ? OFFSET ?",
			[teacherId, limit, offset]
		);

		let attendance = rows.map((item) => {
			return {
				...item,
				present: JSON.parse(item.present || "[]"),
				absent: JSON.parse(item.absent || "[]"),
				late_present: JSON.parse(item.late_present || "[]"),
			};
		});

		const totalCountResult = await turso.execute(
			"SELECT COUNT(*) as count FROM attendance WHERE teacherId = ?",
			[teacherId]
		);
		const totalCount = totalCountResult.rows[0].count;

		const hasMore = page * limit < totalCount;

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










console.log(await turso.execute("pragma table_info(attendance_details)"))



await turso.execute(`

CREATE TABLE IF NOT EXISTS attendance (
    attendanceId INTEGER PRIMARY KEY AUTOINCREMENT,
    course TEXT NOT NULL,
    year TEXT NOT NULL,
    hour INTEGER NOT NULL,
    date DATE NOT NULL,
    timestamp TEXT NOT NULL,
    teacherId TEXT NOT NULL,
    UNIQUE (course, year, hour, date)  -- prevent double attendance
);`
)

turso.execute(`
CREATE TABLE IF NOT EXISTS attendance_details (
    attendanceDetailsId INTEGER PRIMARY KEY AUTOINCREMENT,
    attendanceId INTEGER NOT NULL,
    studentId TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present','absent')),
    FOREIGN KEY (attendanceId) REFERENCES attendance(attendanceId) ON DELETE CASCADE,
    FOREIGN KEY (studentId) REFERENCES students(studentId)
);


`)





export default router;
