import ExcelJS from "exceljs";
import puppeteer from "puppeteer";
import streamifier from "streamifier";

import { turso } from "../../config/turso.js";
import cloudinary from "../../config/cloudinary.js";
import getPreviewUrl from "../../utils/previewUrl.js";
import { deleteFile } from "../../utils/cloudinary.js";
import MonthlyReport from "../../models/monthlyAttendanceReport.js";
import { sendPushNotificationToClassStudents } from "../../utils/notification.js";

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

export const getAttendanceReportByDateRange = async ({
    course,
    classYear,
    startDate, // YYYY-MM-DD
    endDate, // YYYY-MM-DD
    studentId = null
}) => {
    try {
        if (!studentId && (!course || !classYear)) {
            throw new Error(
                "course and classYear are required when studentId is not provided"
            );
        }

        if (!startDate || !endDate) {
            throw new Error("startDate and endDate are required");
        }

        const studentFilterSQL = studentId
            ? `AND ad.studentId = ?`
            : `AND a.course = ? AND a.year = ?`;

        const args = studentId
            ? [startDate, endDate, studentId]
            : [startDate, endDate, course, classYear];

        const result = await turso.execute({
            sql: `
            WITH daily_sections AS (
                SELECT
                    ad.studentId,
                    a.date,

                    COUNT(DISTINCT CASE
                        WHEN a.hour IN ('First','Second','Third')
                        THEN a.hour END
                    ) AS first_total,

                    COUNT(DISTINCT CASE
                        WHEN a.hour IN ('Fourth','Fifth')
                        THEN a.hour END
                    ) AS second_total,

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

                WHERE a.date BETWEEN ? AND ?
                ${studentFilterSQL}

                GROUP BY ad.studentId, a.date

                HAVING COUNT(DISTINCT CASE
                    WHEN a.hour IN ('First','Second','Third','Fourth','Fifth')
                    THEN a.hour END
                ) > 0
            ),

            daily_attendance AS (
                SELECT
                    studentId,
                    date,
                    CASE
                        WHEN first_total > 0 AND second_total > 0 THEN
                            CASE
                                WHEN first_present = first_total
                                AND second_present = second_total THEN 1.0
                                WHEN first_present < first_total
                                AND second_present < second_total THEN 0.0
                                ELSE 0.5
                            END

                        WHEN first_total > 0 AND second_total = 0 THEN
                            CASE
                                WHEN first_present = first_total THEN 1.0
                                WHEN first_present = 0 THEN 0.0
                                ELSE 0.5
                            END

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
        console.error(error);
        return [];
    }
};

export const getMonthlyAttendanceReport = async ({
    course,
    classYear, // class year (eg: "Third")
    month, // month must be in range of 1 ro 12
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

        if (month == null || !calendarYear) {
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
            args
        });

        return result.rows;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// ------------------ EXCEL ------------------

async function generateAttendanceExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    sheet.columns = [
        { header: " Student ID", key: "studentId" },
        { header: " Working Days", key: "working_days" },
        { header: " Present Days", key: "present_days" },
        { header: " Absent Days", key: "absent_days" },
        { header: " Percentage", key: "attendance_percentage" }
    ];

    data.forEach(row =>
        sheet.addRow({ ...row, studentId: ` ${row.studentId}` })
    );

    sheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell(cell => {
            const cellValue = cell.value ? cell.value.toString() : "";
            maxLength = Math.max(maxLength, cellValue.length);
        });
        column.width = maxLength + 2;
    });

    return await workbook.xlsx.writeBuffer();
}

// ------------------ PDF ------------------

async function generateAttendancePDF({
    data,
    course,
    year,
    startMonth,
    endMonth,
    startYear,
    endYear
}) {
    const title =
        startMonth === endMonth && startYear === endYear
            ? `${monthNames[startMonth]} ${startYear}`
            : `${monthNames[startMonth]} ${startYear} to ${monthNames[endMonth]} ${endYear}`;

    const generateDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const avgPct = Math.round(
        data.reduce((s, i) => s + i.attendance_percentage, 0) / data.length
    );
    const belowThreshold = data.filter(
        i => i.attendance_percentage < 75
    ).length;
    const workingDays = data[0]?.working_days ?? 0;

    function pctStyle(p) {
        if (p >= 85) return "background:#d1fae5;color:#065f46;";
        if (p >= 75) return "background:#fef3c7;color:#92400e;";
        return "background:#fee2e2;color:#991b1b;";
    }

    const html = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@500&display=swap');

          :root {
            --brand:       #1a56db;
            --brand-light: #e8effd;
            --accent:      #0e9f6e;
            --danger:      #e3342f;
            --warn:        #f59e0b;
            --neutral-50:  #f9fafb;
            --neutral-100: #f3f4f6;
            --neutral-200: #e5e7eb;
            --neutral-400: #9ca3af;
            --neutral-600: #4b5563;
            --neutral-800: #1f2937;
          }

          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: 'DM Sans', Arial, sans-serif;
            color: var(--neutral-800);
            background: #fff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .card {
            width: 100%;
            background: #fff;
            border: 1px solid var(--neutral-200);
            border-radius: 10px;
            overflow: hidden;
          }

          .card-header {
            background: var(--brand);
            padding: 24px 32px 20px;
            display: flex;
            align-items: flex-start;
            gap: 14px;
          }

          .header-icon {
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,.18);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .header-icon svg { width: 20px; height: 20px; fill: #fff; }

          .header-title {
            font-size: 1.05rem;
            font-weight: 600;
            color: #fff;
            letter-spacing: -.01em;
            line-height: 1.35;
          }

          .header-sub {
            font-size: .75rem;
            color: rgba(255,255,255,.75);
            margin-top: 4px;
            font-family: 'DM Mono', monospace;
          }

          .summary {
            display: flex;
            gap: 10px;
            padding: 16px 32px;
            border-bottom: 1px solid var(--neutral-200);
            background: var(--neutral-50);
            flex-wrap: wrap;
          }

          .pill {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: #fff;
            border: 1px solid var(--neutral-200);
            border-radius: 999px;
            padding: 5px 12px 5px 7px;
            font-size: .73rem;
            font-weight: 500;
            color: var(--neutral-600);
            white-space: nowrap;
          }

          .pill-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            flex-shrink: 0;
            display: inline-block;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
          }

          thead { display: table-header-group; }

          th {
            font-size: .68rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: .06em;
            color: var(--neutral-400);
            padding: 13px 18px;
            text-align: center;
            background: #fff;
            border-bottom: 2px solid var(--neutral-200);
            white-space: nowrap;
          }

          th:first-child { text-align: left; }

          tr { page-break-inside: avoid; }

          td {
            padding: 11px 18px;
            font-size: .88rem;
            text-align: center;
            color: var(--neutral-800);
            border-bottom: 1px solid var(--neutral-100);
          }

          tbody tr:last-child td { border-bottom: none; }

          td:first-child {
            text-align: left;
            font-family: 'DM Mono', monospace;
            font-size: .78rem;
            font-weight: 500;
            color: var(--brand);
          }

          .pct-badge {
            display: inline-block;
            font-weight: 600;
            font-size: .78rem;
            padding: 3px 10px;
            border-radius: 999px;
          }

          .card-footer {
            padding: 12px 32px;
            border-top: 1px solid var(--neutral-200);
            background: var(--neutral-50);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: .7rem;
            color: var(--neutral-400);
          }

          .footer-badge {
            background: var(--brand-light);
            color: var(--brand);
            font-weight: 600;
            padding: 3px 10px;
            border-radius: 999px;
            font-family: 'DM Mono', monospace;
            font-size: .68rem;
          }
        </style>
      </head>
      <body>
        <div class="card">

          <div class="card-header">
            <div class="header-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
              </svg>
            </div>
            <div>
              <div class="header-title">Attendance Report &mdash; ${year} ${course} &middot; ${title}</div>
            </div>
          </div>

          <div class="summary">
            <span class="pill"><span class="pill-dot" style="background:var(--brand)"></span>${data.length} Students</span>
            <span class="pill"><span class="pill-dot" style="background:var(--accent)"></span>Avg. Attendance: ${avgPct}%</span>
            <span class="pill"><span class="pill-dot" style="background:var(--danger)"></span>Below 75%: ${belowThreshold} Students</span>
            <span class="pill"><span class="pill-dot" style="background:var(--warn)"></span>Working Days: ${workingDays}</span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Working Days</th>
                <th>Present Days</th>
                <th>Absent Days</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              ${data
                  .map(
                      item => `
                <tr>
                  <td>${item.studentId}</td>
                  <td>${item.working_days}</td>
                  <td>${item.present_days}</td>
                  <td>${item.absent_days}</td>
                  <td><span class="pct-badge" style="${pctStyle(item.attendance_percentage)}">${item.attendance_percentage}%</span></td>
                </tr>`
                  )
                  .join("")}
            </tbody>
          </table>

          <div class="card-footer">
            <span>System-generated report &mdash; no signature required.</span>
          </div>

        </div>
      </body>
    </html>
  `;

    let browser = null;

    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--no-first-run",
                "--no-zygote",
                "--single-process"
            ]
        });

        const page = await browser.newPage();

        // waitUntil: "networkidle0" ensures Google Fonts finish loading before capture
        await page.setContent(html, {
            waitUntil: "networkidle0",
            timeout: 60000
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true, // required for colored header/badges/pills
            margin: {
                top: "24px",
                bottom: "24px",
                left: "24px",
                right: "24px"
            },
            timeout: 60000
        });

        return pdfBuffer;
    } finally {
        if (browser) {
            await browser
                .close()
                .catch(err => console.error("Error closing browser:", err));
        }
    }
}

// ------------------ GENERATE XL/PDF ------------------

export const generateReport = async (req, res) => {
    try {
        const { course, year, startMonth, endMonth, startYear, endYear } =
            req.body;
        const { userId: teacherId } = req.user;

        if (
            [course, year, startMonth, endMonth, startYear, endYear].some(
                v => v == null
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters!"
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
            teacherId
        });

        if (existDoc) {
            const samePeriod = startMonth === endMonth && startYear === endYear;

            const filename = samePeriod
                ? `${monthNames[startMonth]}-${startYear}-${year}-${course}`
                : `${monthNames[startMonth]}-${startYear}_to_${monthNames[endMonth]}-${endYear}-${year}-${course}`;

            return res.json({
                success: false,
                message: `Attendance report for this range already exists!`,
                filename,
                xl_url: existDoc.xl_url,
                pdf_url: existDoc.pdf_url,
                startYear,
                startMonth,
                endYear,
                endMonth
            });
        }

        const startDate = `${startYear}-${String(startMonth + 1).padStart(
            2,
            "0"
        )}-01`;

        const endDate = new Date(
            endYear,
            endMonth + 1,
            0 // last day of month
        )
            .toISOString()
            .slice(0, 10);

        const aggregatedData = await getAttendanceReportByDateRange({
            course,
            classYear: year,
            startDate,
            endDate
        });

        if (!aggregatedData.length) {
            return res.json({
                success: false,
                message: "No attendance records found for the selected range."
            });
        }

        const excelBuffer = await generateAttendanceExcel(aggregatedData);
        const pdfBuffer = await generateAttendancePDF({
            data: aggregatedData,
            course,
            year,
            startMonth,
            endMonth,
            startYear,
            endYear
        });

        // Upload Excel
        const { secure_url: xl_url, public_id: xl_public_id } =
            await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "raw",
                        folder: "attendance/xl",
                        public_id: `attendance_${Date.now()}.xlsx`,
                        format: "xlsx"
                    },
                    (err, result) => (err ? reject(err) : resolve(result))
                );
                streamifier.createReadStream(excelBuffer).pipe(uploadStream);
            });

        // Upload PDF
        const { secure_url: pdf_url, public_id: pdf_public_id } =
            await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "image",
                        folder: "attendance/pdf",
                        public_id: `attendance_${Date.now()}.pdf`
                    },
                    (err, result) => (err ? reject(err) : resolve(result))
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
            teacherId
        });

        const samePeriod = startMonth === endMonth && startYear === endYear;

        const uniqueId = Math.floor(100000 + Math.random() * 900000);
        const filename = samePeriod
            ? `${monthNames[startMonth]}-${startYear}-${year}-${course}-${uniqueId}`
            : `${monthNames[startMonth]}-${startYear}_to_${monthNames[endMonth]}-${endYear}-${year}-${course}_uid_${uniqueId}`;

        const notificationData = {
            pdf_url,
            filename,
            teacherId,
            type: "ATTENDANCE_REPORT_GENERATION"
        };

        sendPushNotificationToClassStudents({
            course,
            year,
            title: "Attendance Report Generated",
            body: `Attendance Report For ${filename
                ?.split("-")
                ?.join(" ")} Is Now Available.`,

            data: notificationData,
            image: getPreviewUrl(pdf_url, "raw") ?? null
        });

        return res.json({
            success: true,
            filename,
            xl_url,
            pdf_url,
            startYear,
            startMonth,
            endYear,
            endMonth
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
                v => v == null
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters!"
            });
        }

        const query = {
            course,
            year,
            startMonth,
            endMonth,
            startYear,
            endYear
        };

        if (role === "teacher") query.teacherId = teacherId;

        const existDoc = await MonthlyReport.findOne(query);

        if (!existDoc) {
            return res.json({
                success: false,
                message: "No report found for this range."
            });
        }

        const pdf_public_id = existDoc.pdf_public_id;
        const xl_public_id = existDoc.xl_public_id;

        await Promise.all([
            deleteFile(pdf_public_id),
            deleteFile(xl_public_id),
            MonthlyReport.findByIdAndDelete(existDoc._id)
        ]);

        return res.json({
            success: true,
            message: "Report deleted successfully."
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error!" });
    }
};
