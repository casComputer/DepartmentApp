import { Router } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import Otp from "../models/Otp.js";
import { sendOtpEmail } from "../services/emailService.js";

const router = Router();

// ─── Config ───────────────────────────────────────────────────────────────────
const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 10;
const MAX_VERIFY_ATTEMPTS = 5;
const BCRYPT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateOtp = (length = OTP_LENGTH) => {
    const max = Math.pow(10, length);
    return String(crypto.randomInt(0, max)).padStart(length, "0");
};

const minutesFromNow = minutes => new Date(Date.now() + minutes * 60 * 1000);

// ─── POST /otp/generate ───────────────────────────────────────────────────────
router.post("/generate", async (req, res) => {
    try {
        const { email } = req.body;
        const { userId } = req.user;

        if (!userId?.trim())
            return res
                .status(400)
                .json({ success: false, message: "userId is required." });

        if (!email?.trim() || !EMAIL_REGEX.test(email.trim()))
            return res.status(400).json({
                success: false,
                message: "A valid email is required."
            });

        const cleanUserId = userId.trim();
        const cleanEmail = email.trim().toLowerCase();

        // Remove any existing unverified OTP for this user
        await Otp.deleteMany({ userId: cleanUserId });

        // Generate, hash, and persist
        const plainOtp = generateOtp();
        const hashedOtp = await bcrypt.hash(plainOtp, BCRYPT_ROUNDS);

        await Otp.create({
            userId: cleanUserId,
            email: cleanEmail,
            otp: hashedOtp,
            attempts: 0,
            verified: false,
            expiresAt: minutesFromNow(OTP_TTL_MINUTES)
        });

        await sendOtpEmail(cleanEmail, plainOtp, OTP_TTL_MINUTES);

        return res.status(200).json({
            success: true,
            message: `OTP sent to ${cleanEmail}. It expires in ${OTP_TTL_MINUTES} minutes.`
        });
    } catch (err) {
        console.error("[OTP Generate]", err);
        return res
            .status(500)
            .json({ success: false, message: "Failed to generate OTP." });
    }
});

// ─── POST /otp/verify ─────────────────────────────────────────────────────────
router.post("/verify", async (req, res) => {
    try {
        const { otp } = req.body;
        const { userId } = req.user;

        if (!userId?.trim())
            return res
                .status(400)
                .json({ success: false, message: "userId is required." });

        if (!otp?.trim())
            return res
                .status(400)
                .json({ success: false, message: "otp is required." });

        const cleanUserId = userId.trim();
        const cleanOtp = otp.trim();

        const record = await Otp.findOne({
            userId: cleanUserId,
            verified: false
        });

        if (!record)
            return res.json({
                success: false,
                message: "No pending OTP found. Please request a new one."
            });

        if (record.expiresAt < new Date()) {
            await Otp.deleteOne({ _id: record._id });
            return res.status(410).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
            await Otp.deleteOne({ _id: record._id });
            return res.status(429).json({
                success: false,
                message:
                    "Too many failed attempts. OTP invalidated. Please request a new one."
            });
        }

        const isMatch = await bcrypt.compare(cleanOtp, record.otp);

        if (!isMatch) {
            record.attempts += 1;
            await record.save();

            const remaining = MAX_VERIFY_ATTEMPTS - record.attempts;
            return res.json({
                success: false,
                message: `Invalid OTP. ${remaining} attempt(s) remaining.`
            });
        }

        // Success — delete the used OTP
        await Otp.deleteOne({ _id: record._id });

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully.",
            userId: cleanUserId,
            email: record.email
        });
    } catch (err) {
        console.error("[OTP Verify]", err);
        return res
            .status(500)
            .json({ success: false, message: "Failed to verify OTP." });
    }
});

// ─── POST /otp/resend ─────────────────────────────────────────────────────────
router.post("/resend", async (req, res) => {
    req.url = "/generate";
    router.handle(req, res);
});

export default router;
