import { turso } from "../../config/turso.js";
import { sendPushNotificationToAllUser } from "../../utils/notification.js";

export const clearTable = async (req, res) => {
    try {
        const { table } = req.body;

        await turso.execute(`
            DELETE FROM ${table}
        `);

        const data = {
            type: "DEFAULT"
        };

        if (table === "users") {
            await sendPushNotificationToAllUsers(
                "Account Removed",
                "Your DC-Connect account has been removed by an administrator. You no longer have access to the platform.",
                data,
                "all"
            );
        } else if (table === "students") {
            await sendPushNotificationToAllUsers(
                "Account Removed",
                "Your DC-Connect account has been removed by an administrator. You no longer have access to the platform.",
                data,
                "students"
            );
        } else if (table === "attendance" || "attendance_details") {
            await sendPushNotificationToAllUsers(
                "Attendance Records Cleared",
                "Attendance records for all classes have been deleted by the admin.",
                data,
                "teachers"
            );
        } else if (table === "worklogs") {
            await sendPushNotificationToAllUsers(
                "Worklog Records Cleared",
                "Worklog records for all teachers have been deleted by the admin.",
                data,
                "teachers"
            );
        }

        res.json({
            success: true
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        });
        console.error(error);
    }
};
