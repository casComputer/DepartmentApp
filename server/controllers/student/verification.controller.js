import { turso } from "../../config/turso.js";

export const verifyStudent = async (req, res) => {
    const { studentId } = req.body;

    try {
        await turso.execute(
            "UPDATE users SET is_verified = true WHERE userId = ?",
            [studentId]
        );
        
        
        res.json({ success: true, message: "Student verified" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

export const cancelStudentVerification = async (req, res) => {
    const { studentId } = req.body;

    try {
    
    	const {rows} = await turso.execute("SELECT * FROM students WHERE userId = ?", [studentId])
    	const student = rows[0] || null
    	
    	if(!student) return res.json({ message: "student not found" , success: false })
    	
    	await turso.execute("UPDATE students SET rollno = null")


        await turso.execute("DELETE FROM users WHERE userId = ?", [
            studentId
        ]);

        res.json({ success: true, message: "Student deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const verifyMultipleStudents = async (req, res) => {
    try {
        const { students } = req.body;

        if (!Array.isArray(students) || students.length === 0)
            return res
                .status(400)
                .json({ error: "students must be a non-empty array" });

        const placeholders = students.map(() => "?").join(",");

        const query = `
            UPDATE users 
            SET is_verified = true
            WHERE userId IN (${placeholders})
        `;

        await turso.execute(query, students);

        res.json({ success: true, message: "students verified" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};


