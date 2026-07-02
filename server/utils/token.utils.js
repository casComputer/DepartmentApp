import "dotenv/config";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import RefreshToken from "../models/RefreshToken.js";

/**
 * Hash the refresh token for secure storage
 * @param {string} token - The refresh token to hash
 * @returns {string} - The hashed token
 */
const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Store a refresh token in MongoDB
 * @param {string} userId - The user ID
 * @param {string} refreshToken - The refresh token
 * @param {Object} metadata - Optional metadata (ipAddress, userAgent)
 * @returns {Promise<Object>} - The stored token document
 */
export const storeRefreshToken = async (userId, refreshToken, metadata = {}) => {
    try {
        // Calculate expiration based on environment variable or default (7 days)
        let expiresInSeconds = 7 * 24 * 60 * 60; // 7 days
        const envExpiry = process.env.REFRESH_TOKEN_EXPIRES;

        if (envExpiry) {
            const match = envExpiry.match(/^(\d+)([smhd])$/);
            if (match) {
                const value = parseInt(match[1], 10);
                const unit = match[2];
                const multipliers = {
                    s: 1,
                    m: 60,
                    h: 60 * 60,
                    d: 24 * 60 * 60
                };
                expiresInSeconds = value * multipliers[unit];
            }
        }

        const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
        const tokenHash = hashToken(refreshToken);

        const storedToken = await RefreshToken.create({
            userId,
            token: refreshToken,
            tokenHash,
            expiresAt,
            ipAddress: metadata.ipAddress || null,
            userAgent: metadata.userAgent || null
        });

        return storedToken;
    } catch (error) {
        console.error("Error storing refresh token:", error);
        throw new Error("Failed to store refresh token");
    }
};

/**
 * Verify a refresh token exists and is valid
 * @param {string} userId - The user ID
 * @param {string} token - The refresh token to verify
 * @returns {Promise<boolean>} - True if valid, false otherwise
 */
export const verifyRefreshToken = async (userId, token) => {
    try {
        const tokenHash = hashToken(token);

        const storedToken = await RefreshToken.findOne({
            userId,
            tokenHash,
            isRevoked: false,
            expiresAt: { $gt: new Date() }
        });

        return !!storedToken;
    } catch (error) {
        console.error("Error verifying refresh token:", error);
        return false;
    }
};

/**
 * Revoke all refresh tokens for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - MongoDB update result
 */
export const revokeRefreshToken = async (userId) => {
    try {
        const result = await RefreshToken.updateMany(
            { userId, isRevoked: false },
            {
                isRevoked: true,
                revokedAt: new Date()
            }
        );

        return result;
    } catch (error) {
        console.error("Error revoking refresh token:", error);
        throw new Error("Failed to revoke refresh token");
    }
};

/**
 * Revoke a specific refresh token
 * @param {string} userId - The user ID
 * @param {string} token - The refresh token to revoke
 * @returns {Promise<Object>} - MongoDB update result
 */
export const revokeSpecificRefreshToken = async (userId, token) => {
    try {
        const tokenHash = hashToken(token);

        const result = await RefreshToken.updateOne(
            { userId, tokenHash },
            {
                isRevoked: true,
                revokedAt: new Date()
            }
        );

        return result;
    } catch (error) {
        console.error("Error revoking specific refresh token:", error);
        throw new Error("Failed to revoke refresh token");
    }
};

/**
 * Clean up expired tokens (optional - MongoDB TTL index handles this automatically)
 * Call this periodically via cron job if you want manual cleanup
 * @returns {Promise<Object>} - MongoDB delete result
 */
export const cleanupExpiredTokens = async () => {
    try {
        const result = await RefreshToken.deleteMany({
            expiresAt: { $lt: new Date() }
        });

        console.log(`Cleaned up ${result.deletedCount} expired tokens`);
        return result;
    } catch (error) {
        console.error("Error cleaning up expired tokens:", error);
        throw new Error("Failed to cleanup expired tokens");
    }
};

/**
 * Generate new access and refresh tokens
 * @param {string} userId - The user ID
 * @param {string} role - The user role
 * @returns {Object} - Object containing accessToken and refreshToken
 */
export const generateTokens = (userId, role) => {
    const payload = { userId, role };

    if (!userId || !role) {
        throw new Error("Token payloads (userId, role) are required");
    }

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m"
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d"
    });

    return { accessToken, refreshToken };
};

/**
 * Detect token reuse (security feature)
 * If a token is used twice, it's likely compromised
 * @param {string} userId - The user ID
 * @param {string} token - The refresh token
 * @returns {Promise<boolean>} - True if token has been used before, false otherwise
 */
export const detectTokenReuse = async (userId, token) => {
    try {
        const tokenHash = hashToken(token);

        // Check if this token exists and has been used
        const storedToken = await RefreshToken.findOne({
            userId,
            tokenHash
        });

        if (!storedToken) return false;

        // If token exists and was already used (isRevoked), it might be reuse
        // In practice, after first use, we rotate the token, so finding same token = reuse
        return storedToken.isRevoked || storedToken.createdAt < new Date(Date.now() - 1000);
    } catch (error) {
        console.error("Error detecting token reuse:", error);
        return false;
    }
};
