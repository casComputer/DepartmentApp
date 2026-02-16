import "dotenv/config";

import { turso } from "../../config/turso.js";
import { comparePassword } from "../../utils/auth.utils.js";
import { generateTokens } from "../../utils/token.utils.js";

const signinController = async (req, res) => {
    try {
        let { username, password, userRole } = req.body;
        userRole = userRole.toLowerCase();

        username = username?.trim();
        password = password?.trim();

        if (!username || !password)
            return res.status(400).json({
                success: false,
                error: "Invalid username or password"
            });

        if (
            !userRole ||
            !["student", "teacher", "admin", "parent"].includes(userRole)
        ) {
            return res.status(400).json({
                success: false,
                error: "Invalid user role"
            });
        }

        const existUser = await turso.execute(
            `
            SELECT * FROM users WHERE userId = ?
            `,
            [username]
        );

        if (!existUser.rows.length) {
            return res.status(400).json({
                success: false,
                error: "Invalid username or password"
            });
        }

        let user = existUser.rows[0];

        if (user.role !== userRole) {
            return res.status(403).json({
                success: false,
                error: "Role mismatch"
            });
        }

        const validPassword = await comparePassword(password, user.password);
        if (!validPassword)
            return res.status(400).json({
                success: false,
                error: "Invalid username or password"
            });

        if (user.role === "teacher" || user.role === "admin") {
            const teacherExtra = await turso.execute(
                `
                SELECT
                c.course AS in_charge_course,
                c.year AS in_charge_year,
                tc.course_name,
                tc.year,
                tc.course
                FROM users u
                LEFT JOIN classes c ON c.in_charge = u.userId
                LEFT JOIN teacher_courses tc ON tc.teacherId = u.userId
                WHERE u.userId = ?
                `,
                [user.userId]
            );

            const inCharge = teacherExtra.rows.find(
                row => row.in_charge_course && row.in_charge_year
            );

            user.in_charge_course = inCharge?.in_charge_course ?? null;
            user.in_charge_year = inCharge?.in_charge_year ?? null;

            // add courses only if year, course and course_name are present
            user.courses = teacherExtra.rows
                .filter(row => row.course_name && row.year && row.course)
                .map(row => ({
                    course_name: row.course_name,
                    year: row.year,
                    course: row.course
                }));
        } else if (user.role === "student") {
            const studentExtra = await turso.execute(
                `
                SELECT course , year, rollno FROM students WHERE userId = ?
                `,
                [username]
            );

            const { course, year, rollno } = studentExtra?.rows?.[0] ?? {};

            user = {
                ...user,
                course,
                year,
                rollno: rollno ?? -1
            };
        } else if (user.role === "parent") {
            const { rows: students } = await turso.execute(
                `
                SELECT DISTINCT studentId FROM parent_child WHERE parentId = ? AND is_verified = 1
                `,
                [user.userId]
            );

            user = {
                ...user,
                students: students.map(st => st.studentId)
            };
        }

        delete user.password;
   
        const tokens = generateTokens(user.userId, user.role);
        // await storeRefreshToken(user.userId, tokens.refreshToken);

        res.json({
            success: true,
            ...tokens,
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

export default signinController;
