import ExcelJS from "exceljs";
import streamifier from "streamifier";

import { turso } from "../../config/turso.js";
import cloudinary from "../../config/cloudinary.js";

import { getMonthlyAttendanceReport } from "../../controllers/common/attendance.controller.js";
import { ATTENDANCE_UPDATE_LIMIT_MINUTES as UPDATE_LIMIT_MINUTES } from "../../constants/constants.js";

import {
    sendNotificationForListOfUsers
} from '../../utils/notification.js'

const buildDetailRows = (attendanceId, attendance) =>
    attendance.map(s => ({
        attendanceId,
        studentId: s.userId,
        rollno: s.rollno,
        status: s.present ? "present" : "absent"
    }));

const insertAttendanceDetails = async (tx, rows) => {
    if (!rows.length) return;

    console.log(rows);

    const placeholders = rows.map(() => "(?, ?, ?, ?)").join(", ");
    const values = rows.flatMap(r => [
        r.attendanceId,
        r.studentId,
        r.rollno,
        r.status
    ]);

    await tx.execute({
        sql: `
        INSERT INTO attendance_details
        (attendanceId, studentId, rollno, status)
        VALUES ${placeholders}
        `,
        args: values
    });
};

const isUpdateAllowed = ({ createdAt, isAdmin, isClassTeacher }) => {
    if (isAdmin || isClassTeacher) return true;

    const diffMinutes = (Date.now() - new Date(createdAt).getTime()) / 60000;
    return diffMinutes <= UPDATE_LIMIT_MINUTES;
};

const abort = async (tx, res, payload, status = 200) => {
    await tx.rollback();
    return res.status(status).json(payload);
};

export const save = async (req, res) => {
    const tx = await turso.transaction("write");

    try {
        const { attendance, course, year, hour, attendanceId } = req.body;
        const { userId, role } = req.user;

        if (!attendance?.length || !course || !year || !hour || !userId)
            return abort(tx, res, {
                success: false,
                message: "missing required fields!"
            });

        const presentCount = attendance.filter(s => s.present).length;
        const absentCount = attendance.length - presentCount;

        const now = new Date();
        const date = now.toISOString().slice(0, 10);

        let finalAttendanceId = attendanceId;

        // ================= CREATE =================
        if (!attendanceId) {
            const result = await tx.execute({
                sql: `
                INSERT INTO attendance
                (course, year, hour, timestamp,date, teacherId, present_count, absent_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                args: [
                    course,
                    year,
                    hour,
                    now.toISOString(),
                    date,
                    userId,
                    presentCount,
                    absentCount
                ]
            });

            finalAttendanceId = result.lastInsertRowid;
        }

        // ================= UPDATE =================
        else {
            const { rows } = await tx.execute({
                sql: `
                    SELECT timestamp
                    FROM attendance
                    WHERE attendanceId = ?
                    `,
                args: [attendanceId]
            });

            if (!rows.length)
                return abort(tx, res, {
                    success: false,
                    message: "Attendance not found"
                });

            const { rows: inCharge } = await turso.execute(
                `SELECT in_charge FROM classes c WHERE course = ? AND year = ?`,
                [course, year]
            );

            let isClassTeacher = false;
            if (
                role !== "admin" &&
                inCharge?.length &&
                inCharge[0].in_charge === userId
            )
                isClassTeacher = true;

            if (
                !isUpdateAllowed({
                    createdAt: rows[0].timestamp,
                    isAdmin: role === "admin",
                    isClassTeacher
                })
            )
                return abort(tx, res, {
                    success: false,
                    message: `Updates allowed only within ${UPDATE_LIMIT_MINUTES} minutes`
                });

            await tx.execute({
                sql: `
                UPDATE attendance
                SET present_count = ?,
                absent_count = ?,
                updated_timestamp = ?,
                updated_by = ?
                WHERE attendanceId = ?
                `,
                args: [
                    presentCount,
                    absentCount,
                    now.toISOString(),
                    userId,
                    attendanceId
                ]
            });

            await tx.execute({
                sql: `DELETE FROM attendance_details WHERE attendanceId = ?`,
                args: [attendanceId]
            });
        }

        // ================= DETAILS =================
        const detailRows = buildDetailRows(finalAttendanceId, attendance);
        await insertAttendanceDetails(tx, detailRows);
        await tx.commit();
        
        const notificationData = {
                type: "ATTENDANCE_TAKEN_ALERT"
        }

        sendNotificationForListOfUsers({
            users: attendance.filter(s => !s.present),
            title: "attendance Taken",
            body: `Attendance was now taken, reach class within ${UPDATE_LIMIT_MINUTES} mins.`,
            data: JSON.stringify(notificationData)
            
        });

        return res.json({
            success: true,
            message: attendanceId
                ? "Attendance updated successfully"
                : "Attendance saved successfully"
        });
    } catch (err) {
        await tx.rollback();

        if (err.message?.includes("UNIQUE constraint")) {
            return res.status(409).json({
                success: false,
                message: "Attendance already taken for this hour"
            });
        }

        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getAttandanceTakenByTeacher = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.body;

        const { userId: teacherId, role } = req.user;

        const offset = (page - 1) * limit;
        const userField = role === "teacher" ? "teacherId" : "adminId";

        const { rows: attendance } = await turso.execute(
            `SELECT * FROM attendance WHERE ${userField} = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?`,
            [teacherId, limit, offset]
        );

        const totalCountResult = await turso.execute(
            `SELECT COUNT(*) as count FROM attendance WHERE ${userField} = ?`,
            [teacherId]
        );
        const totalCount = totalCountResult.rows[0].count;

        const hasMore = page * limit < totalCount;

        res.json({
            success: true,
            attendance,
            nextPage: hasMore ? page + 1 : null,
            hasMore
        });
    } catch (err) {
        console.log("Error while fetching attendence: ", err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const fetchStudentsForAttendance = async (req, res) => {
    try {
        const { course, year, hour, date } = req.body;

        if (!course || !year || !hour)
            return res.json({
                success: false,
                message: "course or year is miising"
            });

        // get students
        const { rows } = await turso.execute(
            "SELECT s.userId, s.rollno from students s LEFT JOIN users u ON u.userId = s.userId where s.course = ? and s.year = ? and u.is_verified = true AND s.rollno > 0 ORDER BY s.rollno;",
            [course, year]
        );
        const numberOfStudents = rows?.length || 0;

        // get attendance
        const { rows: attendance } = await turso.execute(
            `
            SELECT ad.rollno, ad.status, a.attendanceId FROM attendance a
            JOIN attendance_details ad
            ON a.attendanceId = ad.attendanceId
            WHERE course = ? AND hour = ? AND year = ? AND date = ?
            `,
            [course, hour, year, date]
        );

        res.json({
            success: true,
            numberOfStudents,
            students: rows,
            attendance
        });
    } catch (err) {
        res.status(500).json({
            message: "insternal server error",
            success: false
        });
        console.log(
            "error while fetching students details for attendance: ",
            err
        );
    }
};

export const getClassAttendance = async (req, res) => {
    try {
        let { course, year, page = 1, limit = 10 } = req.body;

        const { userId, role } = req.user;

        page = Math.max(1, page);
        limit = Math.min(50, Math.max(1, limit));

        if (!userId || !role) {
            return res.json({
                success: false,
                message: "Missing required parameters!"
            });
        }

        if (role === "admin" && (!course || !year)) {
            return res.json({
                success: false,
                message: "Missing required parameters!"
            });
        }

        let query;
        let params = [userId];

        if (role === "teacher") {
            query = `
            SELECT c.course, c.year
            FROM users u
            JOIN classes c ON c.in_charge = u.userId
            WHERE u.userId = ?
            `;
        } else if (role === "admin") {
            query = `
            SELECT 1
            FROM admins
            WHERE adminId = ?
            LIMIT 1
            `;
        } else {
            return res.json({
                success: false,
                message: "Invalid role"
            });
        }

        const { rows: existUser } = await turso.execute(query, params);

        if (existUser.length === 0) {
            return res.json({
                success: false,
                message: "User does not exist"
            });
        }

        if (role === "teacher") {
            if (!existUser[0].course || !existUser[0].year)
                return res.json({
                    success: false,
                    message: "You are not assigned to any class!"
                });

            course = existUser[0].course;
            year = existUser[0].year;
        }

        const offset = (page - 1) * limit;

        const { rows: attendance } = await turso.execute(
            `
            SELECT *
            FROM attendance
            WHERE course = ? AND year = ?
            ORDER BY timestamp DESC
            LIMIT ? OFFSET ?
            `,
            [course, year, limit, offset]
        );

        const totalCountResult = await turso.execute(
            "SELECT COUNT(*) as count FROM attendance WHERE course = ? AND year = ?",
            [course, year]
        );
        const totalCount = totalCountResult.rows[0].count;

        const hasMore = page * limit < totalCount;

        return res.json({
            success: true,
            attendance,
            hasMore,
            nextPage: hasMore ? page + 1 : null
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
