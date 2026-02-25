import nodemailer from "nodemailer";

// ─── Validate required Gmail env vars ────────────────────────────────────────
const assertGmailConfig = () => {
    const missing = ["GMAIL_USER", "GMAIL_APP_PASSWORD"].filter(
        key => !process.env[key]
    );

    if (missing.length) {
        throw new Error(
            `Missing required environment variable(s): ${missing.join(", ")}.\n` +
                "Set GMAIL_USER (your Gmail address) and GMAIL_APP_PASSWORD (16-char Google App Password)."
        );
    }
};

// ─── Singleton transporter ────────────────────────────────────────────────────
let _transporter = null;

const getTransporter = () => {
    if (_transporter) return _transporter;

    assertGmailConfig();

    _transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    return _transporter;
};

/**
 * Verifies the Gmail SMTP connection.
 * Called once at app startup to catch misconfigurations early.
 */
export const verifyConnection = async () => {
    const transporter = getTransporter();
    await transporter.verify();
    console.log("✅  Gmail SMTP connection verified:", process.env.GMAIL_USER);
};

/**
 * Sends an OTP email via Gmail.
 * @param {string} to      - Recipient email address
 * @param {string} otp     - The 6-digit OTP
 * @param {number} ttlMins - Minutes until expiry (shown in email body)
 */
export const sendOtpEmail = async (to, otp, ttlMins = 10) => {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
        from: `"OTP Service" <${process.env.GMAIL_USER}>`,
        to,
        subject: "Your One-Time Password (OTP)",
        text: `Your OTP is: ${otp}\n\nIt expires in ${ttlMins} minutes. Do not share it with anyone.`,
        html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px">
        <h2 style="color:#333">Your One-Time Password</h2>
        <p style="font-size:14px;color:#555">
          Use the OTP below to verify your identity.
          It is valid for <strong>${ttlMins} minutes</strong>.
        </p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:10px;text-align:center;padding:20px 0;color:#2563eb">
          ${otp}
        </div>
        <p style="font-size:12px;color:#999">If you did not request this, please ignore this email.</p>
      </div>
    `
    });

    console.log(`📧  OTP email sent to ${to} [messageId: ${info.messageId}]`);
    return info;
};

verifyConnection();
