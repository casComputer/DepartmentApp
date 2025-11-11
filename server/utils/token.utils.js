import redis from "../config/redis.js";
import jwt from "jsonwebtoken";

export const storeRefreshToken = async (userId, refreshToken) => {
    let expiresInSeconds = 7 * 24 * 60 * 60; // 7d

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

    await redis.set(`refresh:${userId}`, refreshToken, {
        ex: expiresInSeconds
    });
};

export const verifyRefreshToken = async (userId, token) => {
    const stored = await redis.get(`refresh:${userId}`);
    return stored === token;
};

export const revokeRefreshToken = async userId => {
    await redis.del(`refresh:${userId}`);
};

export const generateTokens = (userId, role) => {
    const payload = { userId, role };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "1m"
    });
    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d"
        }
    );
    return { accessToken, refreshToken };
};
