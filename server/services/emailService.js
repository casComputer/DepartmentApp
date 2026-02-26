import nodemailer from "nodemailer";

// Ensure Brevo credentials are set
const assertBrevoConfig = () => {
    const missing = ["BREVO_SMTP_USER", "BREVO_SMTP_PASS"].filter(
        (key) => !process.env[key]
    );

    if (missing.length) {
        throw new Error(
            `Missing required environment variable(s): ${missing.join(", ")}.\n` +
            "Set BREVO_SMTP_USER and BREVO_SMTP_PASS from your Brevo SMTP settings."
        );
    }
};

let _transporter = null;

const getTransporter = () => {
    if (_transporter) return _transporter;

    assertBrevoConfig();

    _transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 465,
        secure: true, // SSL
        auth: {
            user: process.env.BREVO_SMTP_USER, // Brevo SMTP user
            pass: process.env.BREVO_SMTP_PASS, // Brevo SMTP password
        },
    });

    return _transporter;
};

// Verify SMTP connection
export const verifyConnection = async () => {
    try {
        const transporter = getTransporter();
        await transporter.verify();
        console.log("✅ Brevo SMTP connection verified and ready to send emails");
    } catch (err) {
        console.error("❌ Brevo SMTP verification failed:", err.message);
    }
};

// Send OTP email via Brevo
export const sendOtpEmail = async (to, otp, ttlMins = 10) => {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
        from: `"DC-Connect" <cas.department.computer@gmail.com>`, // Must be a verified sender in Brevo
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
      `,
    });

    console.log(`✅ OTP email sent to ${to}: ${info.messageId}`);
};

// Example usage
verifyConnection();
sendOtpEmail("adwaith.anand.dev@gmail.com", "123456").catch(console.error);

