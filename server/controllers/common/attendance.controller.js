import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import streamifier from "streamifier";

import { turso } from "../../config/turso.js";
import cloudinary from "../../config/cloudinary.js";
import { deleteFile, getPublicIdFromUrl } from "../../utils/cloudinary.js";
import MonthlyReport from "../../models/monthlyAttendanceReport.js";

export const getMonthlyAttendanceReport = async ({
    course,
    classYear, // class year (eg: "Third")
    month, // month must be in range of 1 ro 12
    calendarYear,
    studentId = null,
}) => {
    try {
        if (!studentId) {
            if (!course || !classYear) {
                throw new Error(
                    "course and classYear are required when studentId is not provided",
                );
            }
        }

        if (month == null || !calendarYear) {
            throw new Error(
                "course, classYear, month, calendarYear are required",
            );
        }

        const monthStr = String(month).padStart(2, "0");
        const yearStr = String(calendarYear);

        const studentFilterSQL = studentId
            ? `AND ad.studentId = ? `
            : `AND a.course = ? AND a.year = ?`;

        const args = studentId
            ? [yearStr, monthStr, studentId]
            : [yearStr, monthStr, course, classYear];

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
            args,
        });

        return result.rows;
    } catch (error) {
        console.log(error);
        return [];
    }
};

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// ------------------ EXCEL ------------------

async function generateAttendanceExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    sheet.columns = [
        { header: " Student ID", key: "studentId" },
        { header: " Working Days", key: "working_days" },
        { header: " Present Days", key: "present_days" },
        { header: " Absent Days", key: "absent_days" },
        { header: " Percentage", key: "attendance_percentage" },
    ];

    data.forEach((row) =>
        sheet.addRow({ ...row, studentId: ` ${row.studentId}` }),
    );

    sheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell((cell) => {
            const cellValue = cell.value ? cell.value.toString() : "";
            maxLength = Math.max(maxLength, cellValue.length);
        });
        column.width = maxLength + 2;
    });

    return await workbook.xlsx.writeBuffer();
}

// ------------------ PDF ------------------

function generateAttendancePDF(
    data,
    { course, year, startMonth, endMonth, startYear, endYear },
) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: "A4" });
            const buffers = [];
            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => resolve(Buffer.concat(buffers)));

            const title =
                startMonth === endMonth && startYear === endYear
                    ? `${monthNames[startMonth]} ${startYear}`
                    : `${monthNames[startMonth]} ${startYear} → ${monthNames[endMonth]} ${endYear}`;

            doc.fontSize(18)
                .font("Helvetica-Bold")
                .text(`Attendance Report for ${year} ${course} – ${title}`, {
                    align: "center",
                })
                .moveDown()
                .fontSize(14)
                .font("Times-Roman")
                .table({
                    rowStyles: [30],
                    data: [
                        [
                            "StudentId",
                            "Working Days",
                            "Present Days",
                            "Absent Days",
                            "Percentage",
                        ],
                        ...data.map((item) => Object.values(item)),
                    ],
                });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}

// ------------------ GENERATE XL/PDF ------------------

export const generateXlSheet = async (req, res) => {
    try {
        const { course, year, startMonth, endMonth, startYear, endYear } =
            req.body;
        const { userId: teacherId } = req.user;

        if (
            [course, year, startMonth, endMonth, startYear, endYear].some(
                (v) => v == null,
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters!",
            });
        }

        // Check if report already exists for this range
        const existDoc = await MonthlyReport.findOne({
            course,
            year,
            startMonth,
            endMonth,
            startYear,
            endYear,
            teacherId,
        });

        if (existDoc) {
            return res.json({
                success: false,
                message: `Attendance report for this range already exists!`,
                xl_url: existDoc.xl_url,
                pdf_url: existDoc.pdf_url,
                filename: `${existDoc.startMonth}-${existDoc.startYear}_to_${existDoc.endMonth}-${existDoc.endYear}-${year}-${course}`,
            });
        }

        // Aggregate attendance data for all months in the range
        let aggregatedData = [];
        for (let y = startYear; y <= endYear; y++) {
            let mStart = y === startYear ? startMonth : 0;
            let mEnd = y === endYear ? endMonth : 11;

            for (let m = mStart; m <= mEnd; m++) {
                const data = await getMonthlyAttendanceReport({
                    course,
                    classYear: year,
                    month: m + 1, // helper expects 1-12
                    calendarYear: y,
                });
                aggregatedData.push(...data);
            }
        }

        if (!aggregatedData.length) {
            return res.json({
                success: false,
                message: "No attendance records found for the selected range.",
            });
        }

        const excelBuffer = await generateAttendanceExcel(aggregatedData);
        const pdfBuffer = await generateAttendancePDF(aggregatedData, {
            course,
            year,
            startMonth,
            endMonth,
            startYear,
            endYear,
        });

        // Upload Excel
        const { secure_url: xl_url, public_id: xl_public_id } =
            await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "raw",
                        folder: "attendance/xl",
                        public_id: `attendance_${Date.now()}.xlsx`,
                        format: "xlsx",
                    },
                    (err, result) => (err ? reject(err) : resolve(result)),
                );
                streamifier.createReadStream(excelBuffer).pipe(uploadStream);
            });

        // Upload PDF
        const { secure_url: pdf_url, public_id: pdf_public_id } =
            await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "raw",
                        folder: "attendance/pdf",
                        public_id: `attendance_${Date.now()}.pdf`,
                        format: "pdf",
                    },
                    (err, result) => (err ? reject(err) : resolve(result)),
                );
                streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
            });

        // Save report document
        await MonthlyReport.create({
            startMonth,
            endMonth,
            startYear,
            endYear,
            year,
            course,
            xl_url,
            xl_public_id,
            pdf_url,
            pdf_public_id,
            teacherId,
        });

        return res.json({
            success: true,
            xl_url,
            pdf_url,
            filename: `${monthNames[startMonth]}-${startYear}_to_${monthNames[endMonth]}-${endYear}-${year}-${course}`,
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

// ------------------ DELETE ------------------

export const deleteReport = async (req, res) => {
    try {
        const { course, year, startMonth, endMonth, startYear, endYear } =
            req.body;
        const { userId: teacherId, role } = req.user;

        if (
            [course, year, startMonth, endMonth, startYear, endYear].some(
                (v) => v == null,
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters!",
            });
        }

        const query = {
            course,
            year,
            startMonth,
            endMonth,
            startYear,
            endYear,
        };

        if (role === "teacher") query.teacherId = teacherId;

        const existDoc = await MonthlyReport.findOne(query);

        if (!existDoc) {
            return res.json({
                success: false,
                message: "No report found for this range.",
            });
        }

        const pdf_public_id = existDoc.pdf_public_id;
        const xl_public_id = existDoc.xl_public_id;

        await Promise.all([
            deleteFile(pdf_public_id),
            deleteFile(xl_public_id),
            MonthlyReport.findByIdAndDelete(existDoc._id),
        ]);

        return res.json({
            success: true,
            message: "Report deleted successfully.",
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error!" });
    }
};
