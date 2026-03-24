import { turso } from "../../config/turso.js";
import { sendPushNotificationToAllUsers } from "../../utils/notification.js";
import { deleteFolderFiles } from "../../utils/cloudinary.js";

import Assignment from "../../models/assignment.js";
import Result from "../../models/examResult.js";
import Internal from "../../models/internalMark.js";
import Report from "../../models/monthlyAttendanceReport.js";
import Notes from "../../models/notes.js";
import Notification from "../../models/notification.js";

export const clearDbDocuments = async (req, res) => {
    try {
        const { collection } = req.body;

        const collectionMap = {
            assignments: Assignment,
            "exam-results": Result,
            "internal-marks": Internal,
            "attendance-reports": Report,
            notes: Notes,
            notifications: Notification
        };

        const folderMap = {
            assignments: "assignment",
            "exam-results": "exam_result",
            "internal-marks": "internal_mark",
            "attendance-reports": "attendance",
            notes: "notes"
        };

        const Model = collectionMap[collection];

        if (!Model) {
            return res.status(400).json({
                success: false,
                message: "Invalid collection name"
            });
        }

        await Model.deleteMany({});

        const folder = folderMap[collection];
        if (folder) {
            await deleteFolderFiles(folder);
        }

        return res.json({
            success: true,
            message: `${collection} cleared successfully`
        });
    } catch (e) {
        console.error("Error while deleting mongodb documents:", e);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting documents"
        });
    }
};

export const clearTable = async (req, res) => {
    try {
        const { table } = req.body;

        await turso.execute(`
            DELETE FROM ?
        `, [table]);

        const data = {
            type: "DEFAULT"
        };

        if (table === "attendance") {
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
        } else if (table === "fees") {
            await sendPushNotificationToAllUsers(
                "Fee Records Cleared",
                "Fee records for all students have been deleted by the admin.",
                data,
                "students"
            );
        }

        res.json({
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
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
            role === "all" ? [] : [role]
        );

        const data = {
            type: "ACCOUNT_REMOVED"
        };

        await sendPushNotificationToAllUsers(
            "Account Removed",
            "Your DC-Connect account has been removed by an administrator. You no longer have access to the platform.",
            data,
            role === "all" ? "all" : role
        );

        res.json({
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
        console.error(error);
    }
};
