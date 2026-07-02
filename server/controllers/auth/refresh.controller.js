import "dotenv/config";
import jwt from "jsonwebtoken";

import {
    storeRefreshToken,
    verifyRefreshToken,
    revokeRefreshToken,
    generateTokens,
    detectTokenReuse
} from "../../utils/token.utils.js";

/**
 * Token rotation strategy: 
 * Old token is revoked after new token is issued
 * This prevents token reuse attacks
 */
export const refreshTokenRotation = async (req, res) => {
    const { refreshToken: clientRefreshToken } = req.body;

    if (!clientRefreshToken) {
        return res.status(401).json({ 
            success: false,
            message: "No token provided" 
        });
    }

    try {
        jwt.verify(
            clientRefreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET,
            async (err, user) => {
                if (err) {
                    return res.status(403).json({
                        success: false,
                        message: "Invalid or expired token"
                    });
                }

                try {
                    const userId = user.userId;
                    const role = user.role;

                    // Verify token is valid and not revoked
                    const isValid = await verifyRefreshToken(userId, clientRefreshToken);

                    if (!isValid) {
                        // Possible token reuse detected
                        const isReuse = await detectTokenReuse(userId, clientRefreshToken);
                        
                        if (isReuse) {
                            console.warn(`⚠️ Possible token reuse detected for user: ${userId}`);
                            // Revoke all tokens for this user (security measure)
                            await revokeRefreshToken(userId);
                        }

                        return res.status(403).json({
                            success: false,
                            message: "Token has been revoked or already used"
                        });
                    }

                    // Generate new tokens
                    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
                        userId,
                        role
                    );

                    // Store new refresh token in MongoDB
                    const metadata = {
                        ipAddress: req.ip || req.connection.remoteAddress,
                        userAgent: req.get("user-agent")
                    };

                    await storeRefreshToken(userId, newRefreshToken, metadata);

                    // Revoke old token (after issuing new one for safety)
                    // This implements refresh token rotation
                    await revokeRefreshToken(userId);

                    return res.status(200).json({
                        success: true,
                        accessToken,
                        refreshToken: newRefreshToken
                    });
                } catch (error) {
                    console.error("Error during token rotation:", error);
                    return res.status(500).json({
                        success: false,
                        message: "Token rotation failed"
                    });
                }
            }
        );
    } catch (error) {
        console.error("Token rotation error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

/**
 * Simple access token refresh without rotation
 * Use this if you don't want to rotate refresh tokens
 * Less secure than refreshTokenRotation
 */
export const refreshAccessToken = async (req, res) => {
    const { refreshToken: clientRefreshToken } = req.body;

    if (!clientRefreshToken) {
        return res.status(401).json({ 
            success: false,
            message: "No token provided" 
        });
    }

    try {
        jwt.verify(
            clientRefreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET,
            async (err, user) => {
                if (err) {
                    return res.status(403).json({
                        success: false,
                        message: "Invalid or expired token"
                    });
                }

                try {
                    const userId = user.userId;
                    const role = user.role;

                    // Verify token is valid and not revoked
                    const isValid = await verifyRefreshToken(userId, clientRefreshToken);

                    if (!isValid) {
                        return res.status(403).json({
                            success: false,
                            message: "Token has been revoked"
                        });
                    }

                    // Create a new ACCESS TOKEN only (refresh token stays the same)
                    const accessToken = jwt.sign(
                        { userId, role },
                        process.env.JWT_ACCESS_TOKEN_SECRET,
                        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" }
                    );

                    return res.status(200).json({
                        success: true,
                        accessToken
                    });
                } catch (error) {
                    console.error("Error refreshing access token:", error);
                    return res.status(500).json({
                        success: false,
                        message: "Failed to refresh access token"
                    });
                }
            }
        );
    } catch (error) {
        console.error("Access token refresh error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
