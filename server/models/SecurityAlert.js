import mongoose from "mongoose";

const securityAlertSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },
        alertType: {
            type: String,
            enum: [
                "TOKEN_REUSE",
                "UNUSUAL_LOGIN",
                "MULTIPLE_FAILED_ATTEMPTS",
                "SUSPICIOUS_TOKEN_ACTIVITY",
                "SESSION_ANOMALY"
            ],
            required: true
        },
        severity: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            default: "MEDIUM"
        },
        message: {
            type: String,
            required: true
        },
        details: {
            ipAddress: String,
            userAgent: String,
            timestamp: Date
        },
        createdAt: {
            type: Date,
            default: Date.now,
            index: true
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
            index: { expireAfterSeconds: 0 }
        }
    },
    {
        versionKey: false
    }
);

// Indexes for efficient queries
securityAlertSchema.index({ userId: 1, alertType: 1 });
securityAlertSchema.index({ severity: 1, createdAt: -1 });

export default mongoose.model("SecurityAlert", securityAlertSchema);
