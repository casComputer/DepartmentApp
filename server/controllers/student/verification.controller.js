import { turso } from "../../config/turso.js";
import { sendNotificationForListOfUsers } from "../../utils/notification.js";

export const verifyStudent = async (req, res) => {
    const { studentId } = req.body;

    try {
        await turso.execute(
            "UPDATE users SET is_verified = true WHERE userId = ?",
            [studentId]
        );

        sendNotificationForListOfUsers({
            users: [studentId],
            title: `You're Verified! 🎉`,
            body: `Great news! Your account is verified and you can now start using the app.`,
            data: {
                type: "VERIFIED"
            }
        });

        res.json({ success: true, message: "Student verified" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

export const cancelStudentVerification = async (req, res) => {
    const { studentId } = req.body;

    try {
        const { rows } = await turso.execute(
            "SELECT * FROM students WHERE userId = ?",
            [studentId]
        );
        const student = rows[0] || null;

        if (!student)
            return res.json({ message: "student not found", success: false });

        await turso.execute("DELETE FROM users WHERE userId = ?", [studentId]);

        sendNotificationForListOfUsers({
            users: [studentId],
            title: `Account Permanently Removed`,
            body: `Your account has been unverified and permanently deleted. Access to the app has been revoked.`,
            data: {
                type: "DELETED"
            },
            image: null
        });

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

        sendNotificationForListOfUsers({
            users: [students],
            title: `You're Verified! 🎉`,
            body: `Great news! Your account is verified and you can now start using the app.`,
            data: {
                type: "VERIFIED"
            }
        });

        res.json({ success: true, message: "students verified" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const removeAllByClassTeacher = async (req, res) => {
    try {
        const { userId } = req.user;

        const { rows: students } = await turso.execute(
            `
        DELETE FROM users
            WHERE userId IN (
                SELECT userId FROM students s
                    JOIN classes c ON 
                        s.year = c.year AND s.course = c.course
                WHERE c.in_charge = ?
                
            )
            RETURNING userId;
        `,
            [userId]
        );

        if (students?.length)
            sendNotificationForListOfUsers({
                users: [students],
                title: `Account Permanently Removed`,
                body: `Your account has been unverified and permanently deleted. Access to the app has been revoked.`,
                data: {
                    type: "DELETED"
                },
                image: null
            });

        res.json({
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
