import "dotenv/config";

import { turso } from "../../config/turso.js";
import { hashPassword, validateSignupFields } from "../../utils/auth.utils.js";
import { generateTokens, storeRefreshToken } from "../../utils/token.utils.js";

const signupController = async (req, res) => {
    try {
        const { username, password, fullName, course, year } = req.body;
        const userRole = req.body.userRole.toLowerCase();
        validateSignupFields(req.body);

        const existUser = await turso.execute(
            `
        SELECT studentId as id FROM students WHERE studentId = ?
        UNION
        SELECT teacherId as id FROM teachers WHERE teacherId = ?
        UNION
        SELECT parentId as id FROM parents WHERE parentId = ?
        UNION
        SELECT adminId as id FROM admin WHERE adminId = ?
        `,
            [username, username, username, username]
        );

        if (existUser.rows.length > 0) {
            return res
                .status(400)
                .json({ success: false, error: "Username already exists" });
        }

        const hashedPassword = await hashPassword(password);

        if (userRole === "student") {
            await turso.execute(
                `INSERT INTO students (studentId, fullname, password, course, year_of_study) VALUES (?, ?, ?, ?, ?)`,
                [username, fullName, hashedPassword, course, year]
            );
        } else if (userRole === "parent") {
            await turso.execute(
                `INSERT INTO parents (parentId, fullname, password) VALUES (?, ?, ?)`,
                [username, fullName, hashedPassword]
            );
        } else if (userRole === "teacher") {
            await turso.execute(
                `INSERT INTO teachers (teacherId, fullname, password) VALUES (?, ?, ?)`,
                [username, fullName, hashedPassword]
            );
        }

        const tokens = generateTokens(username, userRole);
        await storeRefreshToken(username, tokens.refreshToken);

        let user = {
            fullname: fullName,
            course: course || "",
            year_of_study: year || "",
            userId: username,
            role: userRole
        };

        res.json({ success: true, ...tokens, user });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err.message || "Server error"
        });
    }
};

export default signupController;
