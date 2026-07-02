import { revokeRefreshToken } from "../../utils/token.utils.js";
import jwt from "jsonwebtoken";

const logout = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ 
            success: false,
            message: "No refresh token provided" 
        });
    }

    try {
        jwt.verify(
            refreshToken,
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

                    // Revoke all refresh tokens for this user
                    await revokeRefreshToken(userId);

                    return res.status(200).json({
                        success: true,
                        message: "Logged out successfully"
                    });
                } catch (error) {
                    console.error("Error during logout:", error);
                    return res.status(500).json({
                        success: false,
                        message: "Logout failed"
                    });
                }
            }
        );
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during logout"
        });
    }
};

export default logout;
