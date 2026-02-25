import nodemailer from "nodemailer";

// ─── Validate required Brevo env vars ────────────────────────────────────────
const assertBrevoConfig = () => {
    const missing = ["BREVO_SMTP_USER", "BREVO_SMTP_PASS"].filter(
        key => !process.env[key]
    );

    if (missing.length) {
        throw new Error(
            `Missing required environment variable(s): ${missing.join(", ")}.\n` +
                "Set BREVO_SMTP_USER and BREVO_SMTP_PASS from Brevo SMTP settings."
        );
    }
};

// ─── Singleton transporter ────────────────────────────────────────────────────
let _transporter = null;

const getTransporter = () => {
    if (_transporter) return _transporter;

    assertBrevoConfig();

    _transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false, // must be false for 587
        auth: {
            user: process.env.BREVO_SMTP_USER,
            pass: process.env.BREVO_SMTP_PASS
        }
    });

    return _transporter;
};

/**
 * Verifies SMTP connection.
 */
export const verifyConnection = async () => {
    try {
        const transporter = getTransporter();
        await transporter.verify();
        console.log("✅ Brevo SMTP connection verified");
    } catch (err) {
        console.error("❌ SMTP verification failed:", err.message);
    }
};

/**
 * Sends OTP email
 */
export const sendOtpEmail = async (to, otp, ttlMins = 10) => {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
        from: `"OTP Service" <yourverified@yourdomain.com>`, // MUST match verified sender
        to,
        subject: "Your One-Time Password (OTP)",
        text: `Your OTP is: ${otp}\n\nIt expires in ${ttlMins} minutes.`,
        html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px">
        <h2 style="color:#333">Your One-Time Password</h2>
        <p style="font-size:14px;color:#555">
          Use the OTP below. Valid for <strong>${ttlMins} minutes</strong>.
        </p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:10px;text-align:center;padding:20px 0;color:#2563eb">
          ${otp}
        </div>
        <p style="font-size:12px;color:#999">If you did not request this, ignore this email.</p>
      </div>
    `
    });

    console.log(`📧 OTP email sent to ${to} [messageId: ${info.messageId}]`);
    return info;
};

verifyConnection();
