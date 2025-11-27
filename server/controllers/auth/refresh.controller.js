import "dotenv/config";
import jwt from "jsonwebtoken";

import {
    storeRefreshToken,
    verifyRefreshToken,
    revokeRefreshToken,
    generateTokens
} from "../../utils/token.utils.js";

export const refreshTokenRotation = async (req, res) => {
    const { refreshToken: clientRefreshToken } = req.body;
    if (!clientRefreshToken)
        return res.status(401).json({ message: "No token provided" });

    jwt.verify(
        clientRefreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        async (err, user) => {
            if (err)
                return res
                    .status(403)
                    .json({ message: "Invalid or expired token" });

            const userId = user.userId,
                role = user.role;
                
            const valid = await verifyRefreshToken(userId, clientRefreshToken);
            if (!valid)
                return res
                    .status(403)
                    .json({ message: "Token already used or invalid" });

            await revokeRefreshToken(userId);

            console.log(
                "refreshing token for user ",
                userId,
                " with role ",
                role
            );

            const { accessToken, refreshToken: newRefreshToken } =
                generateTokens(userId, role);

            await storeRefreshToken(userId, newRefreshToken);

            res.json({ accessToken, refreshToken: newRefreshToken });
        }
    );
};

export const refreshAccessToken = async (req, res) => {
    const { refreshToken: clientRefreshToken } = req.body;
    if (!clientRefreshToken)
        return res.status(401).json({ message: "No token provided" });

    jwt.verify(
        clientRefreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        (err, user) => {
            if (err)
                return res
                    .status(403)
                    .json({ message: "Invalid or expired token" });

            const userId = user.userId;
            const role = user.role;

            // create a new ACCESS TOKEN
            const accessToken = jwt.sign(
                { userId, role },
                process.env.JWT_ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            return res.json({ accessToken });
        }
    );
};

