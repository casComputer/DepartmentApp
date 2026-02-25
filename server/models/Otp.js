import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Otp", otpSchema);
