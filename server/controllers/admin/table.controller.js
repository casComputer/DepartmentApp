import { turso } from "../../config/turso.js";
import { sendPushNotificationToAllUsers } from "../../utils/notification.js";

export const clearTable = async (req, res) => {
    try {
        const { table } = req.body;

        await turso.execute(`
            DELETE FROM ${table}
        `);

        const data = {
            type: "DEFAULT",
        };

        if (table === "attendance") {
            await sendPushNotificationToAllUsers(
                "Attendance Records Cleared",
                "Attendance records for all classes have been deleted by the admin.",
                data,
                "teachers",
            );
        } else if (table === "worklogs") {
            await sendPushNotificationToAllUsers(
                "Worklog Records Cleared",
                "Worklog records for all teachers have been deleted by the admin.",
                data,
                "teachers",
            );
        } else if (table === "fees") {
            await sendPushNotificationToAllUsers(
                "Fee Records Cleared",
                "Fee records for all students have been deleted by the admin.",
                data,
                "students",
            );
        }

        res.json({
            success: true,
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
        });
        console.error(error);
    }
};

export const clearAllUsers = async (req, res) => {
    try {
        const { role = "all" } = req.body;

        const possibleRoles = ["students", "teachers", "parents", "all"];

        const condition = role === "all" ? "" : `WHERE role = ?`;

        await turso.execute(
            `
            DELETE FROM users ${condition}
        `,
            role === "all" ? [] : [role],
        );

        const data = {
            type: "ACCOUNT_REMOVED",
        };

        await sendPushNotificationToAllUsers(
            "Account Removed",
            "Your DC-Connect account has been removed by an administrator. You no longer have access to the platform.",
            data,
            role === "all" ? "all" : role,
        );

        res.json({
            success: true,
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
        });
        console.error(error);
    }
};
