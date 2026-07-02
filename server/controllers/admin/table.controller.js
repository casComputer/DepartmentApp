import { turso } from "../../config/turso.js";
import { sendPushNotificationToAllUsers } from "../../utils/notification.js";
import { deleteFilesBulk } from "../../utils/cloudinary.js";

import Assignment from "../../models/assignment.js";
import Result from "../../models/examResult.js";
import Internal from "../../models/internalMark.js";
import Report from "../../models/monthlyAttendanceReport.js";
import Notes from "../../models/notes.js";
import Notification from "../../models/notification.js";

// The `role` column only ever stores singular values ("student", "teacher",
// "parent" — see the CHECK constraint in users.table.js), but this screen
// historically dealt in plural option ids ("students", "teachers", ...).
// Normalizing here fixes a bug where scoped user deletes matched 0 rows.
const ROLE_MAP = {
    students: "student",
    teachers: "teacher",
    parents: "parent"
};

// Field used for date-range scoping per Mongo collection.
const MONGO_DATE_FIELD = {
    assignments: "timestamp",
    "exam-results": "createdAt",
    "internal-marks": "createdAt",
    "attendance-reports": "timestamp",
    notes: "createdAt",
    notifications: "createdAt"
};

// Which collections can be scoped by course/year ("class") vs course only
// (exam-results/internal-marks are organized by `sem`, not `year`).
const MONGO_CLASS_FIELD = {
    assignments: ["course", "year"],
    "attendance-reports": ["course", "year"],
    notes: ["course", "year"],
    "exam-results": ["course"],
    "internal-marks": ["course"]
};

const buildMongoFilter = (collection, { course, year, startDate, endDate }) => {
    const filter = {};

    const classFields = MONGO_CLASS_FIELD[collection] || [];
    if (course && classFields.includes("course")) filter.course = course;
    if (year && classFields.includes("year")) filter.year = year;

    const dateField = MONGO_DATE_FIELD[collection];
    if (dateField && (startDate || endDate)) {
        filter[dateField] = {};
        if (startDate) filter[dateField].$gte = new Date(startDate);
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filter[dateField].$lte = end;
        }
    }

    return filter;
};

export const clearDbDocuments = async (req, res) => {
    try {
        const { collection, course, year, startDate, endDate } = req.body;

        const collectionMap = {
            assignments: Assignment,
            "exam-results": Result,
            "internal-marks": Internal,
            "attendance-reports": Report,
            notes: Notes,
            notifications: Notification
        };

        const Model = collectionMap[collection];

        if (!Model) {
            return res.status(400).json({
                success: false,
                message: "Invalid collection name"
            });
        }

        const filter = buildMongoFilter(collection, {
            course,
            year,
            startDate,
            endDate
        });

        const docs = await Model.find(filter).lean();
        const publicIds = [];

        for (const doc of docs) {
            switch (collection) {
                case "assignments":
                    doc.submissions?.forEach(item => {
                        if (item.public_key) publicIds.push(item.public_key);
                    });
                    break;

                case "exam-results":
                case "internal-marks":
                    if (doc.secure_url) publicIds.push(doc.secure_url);
                    break;

                case "attendance-reports":
                    if (doc.xl_public_id) publicIds.push(doc.xl_public_id);
                    if (doc.pdf_public_id) publicIds.push(doc.pdf_public_id);
                    break;

                case "notes":
                    if (doc.publicId) publicIds.push(doc.publicId);
                    break;

                default:
                    break;
            }
        }

        if (publicIds.length > 0) {
            await deleteFilesBulk(publicIds);
        }

        const { deletedCount } = await Model.deleteMany(filter);

        return res.json({
            success: true,
            message: `${collection} cleared successfully`,
            deletedCount,
            deletedFiles: publicIds.length
        });
    } catch (e) {
        console.error("Error while deleting mongodb documents:", e);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting documents"
        });
    }
};

// Tables that can be scoped by course/year, and which column to use for
// date-range scoping on each.
const TURSO_TABLE_CONFIG = {
    attendance: { classScoped: true, dateColumn: "date" },
    worklogs: { classScoped: true, dateColumn: "date" },
    fees: { classScoped: true, dateColumn: "dueDate" }
};

export const clearTable = async (req, res) => {
    try {
        const { table, course, year, startDate, endDate } = req.body;

        const config = TURSO_TABLE_CONFIG[table];

        if (!config) {
            return res.status(400).json({
                success: false,
                message: "Invalid table name"
            });
        }

        const conditions = [];
        const args = [];

        if (course) {
            conditions.push("course = ?");
            args.push(course);
        }
        if (year) {
            conditions.push("year = ?");
            args.push(year);
        }
        if (startDate) {
            conditions.push(`${config.dateColumn} >= ?`);
            args.push(startDate);
        }
        if (endDate) {
            conditions.push(`${config.dateColumn} <= ?`);
            args.push(endDate);
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        const result = await turso.execute(
            `DELETE FROM ${table} ${whereClause}`,
            args
        );

        const data = { type: "DEFAULT" };
        const isScoped = conditions.length > 0;
        const scopeText =
            course && year
                ? ` for ${year} year ${course.toUpperCase()}`
                : isScoped
                  ? " (a filtered set of)"
                  : " for all classes";

        if (table === "attendance") {
            await sendPushNotificationToAllUsers(
                "Attendance Records Cleared",
                `Attendance records${scopeText} have been deleted by the admin.`,
                data,
                "teacher"
            );
        } else if (table === "worklogs") {
            await sendPushNotificationToAllUsers(
                "Worklog Records Cleared",
                `Worklog records${scopeText} have been deleted by the admin.`,
                data,
                "teacher"
            );
        } else if (table === "fees") {
            await sendPushNotificationToAllUsers(
                "Fee Records Cleared",
                `Fee records${scopeText} have been deleted by the admin.`,
                data,
                "student"
            );
        }

        res.json({
            success: true,
            deletedCount: result.rowsAffected ?? 0
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
        const { role = "all", course, year } = req.body;

        const possibleRoles = ["students", "teachers", "parents", "all"];

        if (!possibleRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        let result;

        if (role === "students" && (course || year)) {
            // Scoped delete: only students in a specific course/year.
            const classConditions = [];
            const classArgs = [];

            if (course) {
                classConditions.push("s.course = ?");
                classArgs.push(course);
            }
            if (year) {
                classConditions.push("s.year = ?");
                classArgs.push(year);
            }

            result = await turso.execute(
                `
                DELETE FROM users
                WHERE role = 'student' AND userId IN (
                    SELECT s.userId FROM students s WHERE ${classConditions.join(" AND ")}
                )
                `,
                classArgs
            );
        } else {
            const dbRole = ROLE_MAP[role] || null; // null when role === "all"
            const condition = dbRole ? "WHERE role = ?" : "";

            result = await turso.execute(
                `DELETE FROM users ${condition}`,
                dbRole ? [dbRole] : []
            );
        }

        const data = { type: "ACCOUNT_REMOVED" };
        const notifyRole = role === "all" ? null : ROLE_MAP[role];

        await sendPushNotificationToAllUsers(
            "Account Removed",
            "Your DC-Connect account has been removed by an administrator. You no longer have access to the platform.",
            data,
            notifyRole
        );

        res.json({
            success: true,
            deletedCount: result.rowsAffected ?? 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
        console.error(error);
    }
};
