import nodemailer from "nodemailer";

const assertBrevoConfig = () => {
    const missing = ["GMAIL_APP_PASSWORD", "GMAIL_USER"].filter(
        key => !process.env[key]
    );

    if (missing.length) {
        throw new Error(
            `Missing required environment variable(s): ${missing.join(", ")}.\n` +
                "Set GMAIL_APP_PASSWORD and GMAIL_USER from Gmail SMTP settings."
        );
    }
};

let _transporter = null;

const getTransporter = () => {
    if (_transporter) return _transporter;

    assertBrevoConfig();

    _transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // must be true for 465
          family: 4,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    return _transporter;
};

export const verifyConnection = async () => {
    try {
        const transporter = getTransporter();
        await transporter.verify();
        console.log("✅ SMTP connection verified");
    } catch (err) {
        console.error("❌ SMTP verification failed:", err.message);
    }
};

export const sendOtpEmail = async (to, otp, ttlMins = 10) => {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
        from: `"DC-Connect  " <cas.department.computer@gmail.com>`,
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

    console.log(`✅ OTP email sent to ${to}: ${info.messageId}`);



};

verifyConnection();

sendOtpEmail("adwaith.anand.dev@gmail.com", "123456").catch(console.error);