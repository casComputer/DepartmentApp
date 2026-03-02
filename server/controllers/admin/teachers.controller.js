import { turso } from "../../config/turso.js";
import { YEAR, COURSES } from "../../constants/YearAndCourse.js";
import { validateCourseAndYear } from "../../utils/validateCourseAndYear.js";
import { sendNotificationForListOfUsers } from "../../utils/notification.js";

export const getTeachers = async (req, res) => {
    try {
        const result = await turso.execute(
            `
            SELECT
            u.userId,
            u.fullname,
            u.is_verified,
            c.course as in_charge_course,
            c.year AS in_charge_year
            FROM users u
            LEFT JOIN classes c ON c.in_charge = u.userId
            WHERE u.role = 'teacher' OR u.role = 'admin'
            ORDER BY u.fullname
            `
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching teachers:", error, error.message);
        res.status(500).json({
            error: "Internal Server Error",
            success: false
        });
    }
};

export const assignClass = async (req, res) => {
    try {
        const { course, year, teacherId } = req.body;

        if (!validateCourseAndYear(course, year))
            return res.json({
                message: "invalid course or year",
                success: false
            });

        const { rows: isExists } = await turso.execute(
            `
            select in_charge from classes where year = ? and course = ? and in_charge IS NOT NULL
            `,
            [year, course]
        );

        if (isExists?.length > 0)
            return res.json({
                message: `Class already assigned to ${isExists[0].in_charge}`,
                success: false
            });

        await turso.execute(
            `
            UPDATE CLASSES set in_charge = NULL WHERE in_charge = ?
            `,
            [teacherId]
        );

        await turso.execute(
            `
            update classes set in_charge = ? where year = ? and course = ?
            `,
            [teacherId, year, course]
        );

        sendNotificationForListOfUsers({
            users: [teacherId],
            title: `Assigned as In-Charge for ${year} ${course}`,
            body: `You have been assigned as the in-charge for ${year} ${course}.`,
            data: {
                type: "IN_CHARGED"
            },
            image: null
        });

        res.json({
            message: "Class assigned successfully",
            success: true
        });
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const removeIncharge = async (req, res) => {
    const { teacherId } = req.body;

    try {
        await turso.execute(
            `UPDATE CLASSES set in_charge = NULL WHERE in_charge = ?`,
            [teacherId]
        );

        sendNotificationForListOfUsers({
            users: [teacherId],
            title: `In-Charge Role Removed`,
            body: `You have been removed from the in-charge role.`,
            data: {
                type: "IN_CHARGE_REMOVED"
            },
            image: null
        });

        res.json({
            success: true
        });
    } catch (error) {
        console.error("Error removing incharge:", error);
        res.status(500).json({
            error: "Internal Server Error",
            success: false
        });
    }
};

export const verifyTeacher = async (req, res) => {
    const { teacherId } = req.body;

    try {
        await turso.execute(
            `update users set is_verified = TRUE where userId = ? AND role = 'teacher'`,
            [teacherId]
        );

        sendNotificationForListOfUsers({
            users: [teacherId],
            title: `You're Verified! 🎉`,
            body: `Great news! Your account is verified and you can now start using the app.`,
            data: {
                type: "VERIFIED"
            },
            image: null
        });

        res.json({
            message: "Teacher verified successfully",
            success: true
        });
    } catch (error) {
        console.error("Error verifying teacher:", error);
        res.status(500).json({
            error: "Internal Server Error",
            success: false
        });
    }
};

export const deleteTeacher = async (req, res) => {
    const { teacherId } = req.body;
    try {
        if (!teacherId)
            return res.json({
                success: false,
                message: `teacherId is compulsory!`
            });

        await turso.execute(
            `DELETE FROM users WHERE userId = ? AND role = 'teacher'`,
            [teacherId]
        );

        sendNotificationForListOfUsers({
            users: [teacherId],
            title: `Account Permanently Removed`,
            body: `Your account has been unverified and permanently deleted. Access to the app has been revoked.`,
            data: {
                type: "DELETED"
            },
            image: null
        });

        res.json({
            success: true,
            message: `Successfully removed user: ${teacherId}`
        });
    } catch (e) {
        console.error("Error while removing teacher: ", e);
        res.json({
            success: false,
            message: `Failed to removed user: ${teacherId}`
        });
    }
};
