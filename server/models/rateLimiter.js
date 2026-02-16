import mongoose from "mongoose";

const rateLimitSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            index: true
        },
        type: {
            type: String,
            required: true,
            enum: ["ip", "username", "fingerprint", "composite"]
        },
        hits: {
            type: Number,
            default: 1
        },
        resetTime: {
            type: Date,
            required: true,
            index: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 86400 // TTL: Auto-delete after 24 hours
        }
    },
    {
        timestamps: false
    }
);

rateLimitSchema.index({ key: 1, type: 1, resetTime: 1 });

export const RateLimit = mongoose.model("RateLimit", rateLimitSchema);

const failedAttemptSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true
    },
    ipAddress: String,
    fingerprint: String,
    attemptedAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // TTL: Auto-delete after 24 hours
    }
});

failedAttemptSchema.index({ username: 1, attemptedAt: -1 });

export const FailedAttempt = mongoose.model(
    "FailedAttempt",
    failedAttemptSchema
);

const accountLockoutSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    lockedUntil: {
        type: Date,
        required: true,
        index: true
    },
    failureCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // TTL: Auto-delete after 24 hours
    }
});

export const AccountLockout = mongoose.model(
    "AccountLockout",
    accountLockoutSchema
);
