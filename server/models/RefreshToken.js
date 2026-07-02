import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    tokenHash: {
        type: String,
        required: true
    },
    isRevoked: {
        type: Boolean,
        default: false,
        index: true
    },
    revokedAt: {
        type: Date,
        default: null
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 } // Auto-delete after expiration
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        default: null
    },
    userAgent: {
        type: String,
        default: null
    }
});

// Compound index for faster queries
refreshTokenSchema.index({ userId: 1, isRevoked: 1 });
refreshTokenSchema.index({ userId: 1, expiresAt: 1 });

export default mongoose.model("RefreshToken", refreshTokenSchema);
