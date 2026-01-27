import "dotenv/config";

import {
    turso
} from "../../config/turso.js";
import {
    hashPassword,
    validateSignupFields
} from "../../utils/auth.utils.js";
import {
    generateTokens,
    storeRefreshToken
} from "../../utils/token.utils.js";

const signupController = async (req, res) => {
    try {
        let {
            username,
            password,
            fullName,
            course,
            year,
            students
        } = req.body;
        const userRole = req.body.userRole.toLowerCase();
        validateSignupFields(req.body);
        
        username = username?.trim()
        password = password?.trim()
        fullName = fullName?.trim()

        const existUser = await turso.execute(
            `
            SELECT userId FROM users WHERE userId = ?
            `,
            [username]
        );

        if (existUser.rows.length > 0) {
            return res
            .status(400)
            .json({
                success: false, error: "Username already exists"
            });
        }

        if (userRole === "parent" && students?.length <= 0)
            return res.json({
            success: false,
            message: "Please select your students to register as parent",
        });

        const hashedPassword = await hashPassword(password);

        await turso.execute(
            `INSERT INTO users (userId, fullname, password, role) VALUES (?, ?, ?, ?)`,
            [username, fullName, hashedPassword, userRole]
        );

        if (userRole === "student") {
            await turso.execute(
                `INSERT INTO students (userId, course, year) VALUES (?, ?, ?)`,
                [username, course, year]
            );
        } else if (userRole === "parent") {
            for (const student of students) {
                await turso.execute(
                    `
                    INSERT INTO parent_child(
                    parentId, studentId
                    ) VALUES (?, ?)
                    `,
                    [username, student]
                );
            }

        }

        const tokens = generateTokens(username, userRole);
        await storeRefreshToken(username, tokens.refreshToken);

        let user = {
            fullname: fullName,
            course: course || "",
            year: year || "",
            userId: username,
            role: userRole,
        };

        res.json({
            success: true, ...tokens, user
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err.message || "Server error",
        });
    }
};

export default signupController;