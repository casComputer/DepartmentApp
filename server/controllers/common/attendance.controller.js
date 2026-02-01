import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import streamifier from "streamifier";

import {
    turso
} from "../../config/turso.js";
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

        if ((month == null || !calendarYear) {
            throw new Error(
                "course, classYear, month, calendarYear are required"
            );
        }

            const monthStr = String(month).padStart(2, "0");
            const yearStr = String(calendarYear);

            const studentFilterSQL = studentId
            ? `AND ad.studentId = ? `: `AND a.course = ? AND a.year = ?`;

            const args = studentId
            ? [yearStr,
                monthStr,
                studentId]: [course,
                classYear,
                yearStr,
                monthStr];

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

        sheet.columns = [{
            header: " Student ID",
            key: "studentId"
        },
            {
                header: " Working Days",
                key: "working_days"
            },
            {
                header: " Present Days",
                key: "present_days"
            },
            {
                header: " Absent Days",
                key: "absent_days"
            },
            {
                header: " Percentage",
                key: "attendance_percentage"
            }];

        data.forEach(row =>
            sheet.addRow({
                ...row,
                studentId: ` ${row.studentId}`
            })
        );

        sheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell(cell => {
                const cellValue = cell.value ? cell.value.toString(): "";
                maxLength = Math.max(maxLength, cellValue.length);
            });
            column.width = maxLength + 2;
        });

        return await workbook.xlsx.writeBuffer();
    }

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
        "December"
    ];

    function generateAttendancePDF(data, {
        course, year, month, calendarYear
    }) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument( {
                    size: "A4"
                });

                const calendarMonth = monthNames[month];

                const buffers = [];
                doc.on("data", buffers.push.bind(buffers));
                doc.on("end", () => resolve(Buffer.concat(buffers)));

                doc.fontSize(14);
                doc.font("Times-Roman");

                console.log(data);

                doc.text(
                    `Attendance Report for ${year} ${course} – ${calendarMonth} ${calendarYear}`
                ).table({
                        rowStyles: [30],
                        data: [
                            [
                                "StudentId",
                                "Working Days",
                                "Present Days",
                                "Absent Days",
                                "Percentage"
                            ],
                            ...data.map(item => Object.values(item))
                        ]
                    });

                doc.end();
            } catch (err) {
                reject(err);
            }
        });
    }

    export const generateXlSheet = async (req, res) => {
        try {
            const {
                course,
                year,
                month,
                calendarYear
            } = req.body;
            const {
                userId: teacherId
            } = req.user;

            if ((month == null || !course || !year || !calendarYear)
                return res.json({
                    success: false,
                    message: "course, year, month, calendarYear are required!"
                });

                console.log(course, year, month, calendarYear)

                let existDoc = await MonthlyReport.findOne({
                    calendarMonth: month,
                    calendarYear,
                    year,
                    course
                });

                existDoc = false // 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥

                if (existDoc)
                    return res.json({
                    success: false,
                    xl_url: existDoc.xl_url,
                    pdf_url: existDoc.pdf_url,
                    message: `Attendance report for ${monthNames[month]}-${year} already exist!`
                });

                const data = await getMonthlyAttendanceReport({
                    course,
                    classYear: year,
                    month,
                    calendarYear
                });

                if (!data || !data.length)
                    return res.json({
                    success: false,
                    message: "Failed to generate attendance report!"
                });

                console.log('\n\ndata: ', data, '\n\n')

                const excelBuffer = await generateAttendanceExcel(data);

                if (!excelBuffer)
                    return res.json({
                    success: false,
                    message: "Failed to generate exel-sheet!"
                });

                const {
                    secure_url: xl_url
                } = await new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            {
                                resource_type: "raw",
                                folder: "attendance/xl",
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

                const pdfBuffer = await generateAttendancePDF(data, {
                    course,
                    year,
                    month,
                    calendarYear
                });

                const {
                    secure_url: pdf_url
                } = await new Promise((resolve,
                        reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            {
                                resource_type: "raw",
                                folder: "attendance/pdf",
                                public_id: `attendance_${Date.now()}.pdf`,
                                format: "pdf"
                            },
                            (error, result) => {
                                if (error) return reject(error);
                                resolve(result);
                            }
                        );

                        streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
                    });

                if (xl_url && pdf_url) {
                    await MonthlyReport.create({
                        calendarYear,
                        calendarMonth: month,
                        course,
                        year,
                        xl_url,
                        pdf_url,
                        teacherId
                    });

                    return res.json({
                        success: true,
                        xl_url,
                        pdf_url
                    });
                }

                return res.json({
                    success: false,
                    message: "Failed to upload exel sheet or pdf to cloud!"
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error"
                });
            }
        };