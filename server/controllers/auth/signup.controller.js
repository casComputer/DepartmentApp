import "dotenv/config";
import { turso } from "../../config/turso.js";
import {
    hashPassword,
    generateTokens,
    validateSignupFields
} from "./authUtils.js";

const signupController = async (req, res) => {
    try {
        const { username, password, fullName, userRole, course, year } =
            req.body;

        validateSignupFields(req.body);

        // Check if username already exists
        const existUser = await turso.execute(
            `SELECT * FROM students WHERE username = ?`,
            [username]
        );
        if (existUser.rows.length) {
            return res
                .status(400)
                .json({ success: false, error: "Username already exists" });
        }

        const hashedPassword = await hashPassword(password);

        if (userRole === "student") {
            await turso.execute(
                `INSERT INTO students (username, fullname, password, role, course, year_of_study) VALUES (?, ?, ?, ?, ?, ?)`,
                [username, fullName, hashedPassword, userRole, course, year]
            );
        } else {
            await turso.execute(
                `INSERT INTO students (username, fullname, password, role) VALUES (?, ?, ?, ?)`,
                [username, fullName, hashedPassword, userRole]
            );
        }

        const tokens = generateTokens(username, userRole);

        res.json({ success: true, ...tokens, data: req.body });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err.message || "Server error"
        });
    }
};

export default signupController;
