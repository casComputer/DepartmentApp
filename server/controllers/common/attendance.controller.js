import ExcelJS from "exceljs";
import streamifier from "streamifier";

import { turso } from "../../config/turso.js";
import cloudinary from "../../config/cloudinary.js";
import MonthlyReport from "../../models/monthlyAttendanceReport.js";

export const getMonthlyAttendanceReport = async ({
    course,
    classYear, // class year (eg: "Third")
    month,
    calendarYear,
    studentId = null
}) => {
    try {
        if (!studentId) {
            if (!course || !classYear) {
                throw new Error(
                    "course and classYear are required when studentId is not provided"
                );
            }
        }

        if (!month || !calendarYear) {
            throw new Error(
                "course, classYear, month, calendarYear are required"
            );
        }

        const monthStr = String(month).padStart(2, "0");
        const yearStr = String(calendarYear);

        const studentFilterSQL = studentId
            ? `AND ad.studentId = ? `
            : `AND a.course = ? AND a.year = ?`;

        const args = studentId
            ? [yearStr, monthStr, studentId]
            : [course, classYear, yearStr, monthStr];

        const result = await turso.execute({
            sql: `
            WITH daily_sections AS (
            SELECT
            ad.studentId,
            a.date,

            -- how many hours were actually conducted
            COUNT(DISTINCT CASE
            WHEN a.hour IN ('First','Second','Third')
            THEN a.hour END
            ) AS first_total,

            COUNT(DISTINCT CASE
            WHEN a.hour IN ('Fourth','Fifth')
            THEN a.hour END
            ) AS second_total,

            -- present hours
            SUM(CASE
            WHEN a.hour IN ('First','Second','Third')
            AND ad.status IN ('present','late')
            THEN 1 ELSE 0 END
            ) AS first_present,

            SUM(CASE
            WHEN a.hour IN ('Fourth','Fifth')
            AND ad.status IN ('present','late')
            THEN 1 ELSE 0 END
            ) AS second_present

            FROM attendance_details ad
            JOIN attendance a
            ON ad.attendanceId = a.attendanceId

            WHERE
            strftime('%Y', a.date) = ?
            AND strftime('%m', a.date) = ?
            ${studentFilterSQL}

            GROUP BY ad.studentId, a.date

            -- exclude days where no hours were conducted
            HAVING NOT (
            COUNT(DISTINCT CASE
            WHEN a.hour IN ('First','Second','Third','Fourth','Fifth')
            THEN a.hour END
            ) = 0
            )
            ),

            daily_attendance AS (
            SELECT
            studentId,
            date,

            CASE
            -- BOTH HALVES CONDUCTED
            WHEN first_total > 0 AND second_total > 0 THEN
            CASE
            WHEN first_present = first_total
            AND second_present = second_total
            THEN 1.0
            WHEN first_present < first_total
            AND second_present < second_total
            THEN 0.0
            ELSE 0.5
            END

            -- ONLY FIRST HALF CONDUCTED
            WHEN first_total > 0 AND second_total = 0 THEN
            CASE
            WHEN first_present = first_total THEN 1.0
            WHEN first_present = 0 THEN 0.0
            ELSE 0.5
            END

            -- ONLY SECOND HALF CONDUCTED
            WHEN first_total = 0 AND second_total > 0 THEN
            CASE
            WHEN second_present = second_total THEN 1.0
            WHEN second_present = 0 THEN 0.0
            ELSE 0.5
            END

            ELSE NULL
            END AS attendance_value
            FROM daily_sections
            )

            SELECT
            studentId,
            COUNT(attendance_value) AS working_days,
            SUM(attendance_value) AS present_days,
            COUNT(attendance_value) - SUM(attendance_value) AS absent_days,
            ROUND(
            (SUM(attendance_value) * 100.0) / COUNT(attendance_value),
            2
            ) AS attendance_percentage
            FROM daily_attendance
            GROUP BY studentId
            ORDER BY studentId;
            `,
            args
        });

        return result.rows;
    } catch (error) {
        console.log(error);
        return [];
    }
};

async function generateAttendanceExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    sheet.columns = [
        {
            header: "Student ID",
            key: "studentId",
            width: 20
        },
        {
            header: "Working Days",
            key: "working_days"
        },
        {
            header: "Present Days",
            key: "present_days"
        },
        {
            header: "Absent Days",
            key: "absent_days"
        },
        {
            header: "Percentage",
            key: "attendance_percentage"
        }
    ];

    data.forEach(row => sheet.addRow(row));

    return await workbook.xlsx.writeBuffer();
}

export const generateXlSheet = async (req, res) => {
    try {
        const { course, year, month, calendarYear } = req.body;
        const { userId: teacherId } = req.user;

        if (!course || !year || !month || !calendarYear)
            throw new Error("course, year, month, calendarYear are required");

        const existDoc = await MonthlyReport.findOne({
            calendarMonth: month,
            calendarYear,
            year,
            course
        });

        if (existDoc)
            return res.json({
                success: false,
                message: "Attendance report for this month already exist!"
            });

        const data = await getMonthlyAttendanceReport({
            course,
            classYear: year,
            month,
            calendarYear
        });
        if (!data)
            return res.json({
                success: false,
                message: "Failed to generate attendance report!"
            });

        const excelBuffer = await generateAttendanceExcel(data);

        if (!excelBuffer)
            return res.json({
                success: false,
                message: "Failed to generate exel-sheet!"
            });

        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: "attendance",
                    public_id: `attendance_${Date.now()}.xlsx`,
                    format: "xlsx"
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            streamifier.createReadStream(excelBuffer).pipe(uploadStream);
        });

        console.log(uploadResult);

        if (uploadResult.secure_url) {
            await MonthlyReport.create({
                calendarYear,
                calendarMonth: month,
                course,
                year,
                secure_url: uploadResult.secure_url,
                teacherId
            });

            return res.json({
                success: true,
                secure_url: uploadResult.secure_url
            });
        }

        return res.json({
            success: false,
            message: "Failed to upload exel sheet to cloud!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
