import "dotenv/config";
import jwt from "jsonwebtoken";

import {
    storeRefreshToken,
    verifyRefreshToken,
    revokeRefreshToken,
    generateTokens
} from "../../utils/token.utils.js";

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(401).json({ message: "No token provided" });

    jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        async (err, user) => {
            if (err)
                return res
                    .status(403)
                    .json({ message: "Invalid or expired token" });

            const userId = user.userId,
                role = user.role;
                
            const valid = await verifyRefreshToken(userId, refreshToken);
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

            console.log(
                "refreshed tokens ",
                accessToken,
                "\n",
                newRefreshToken
            );
            await storeRefreshToken(userId, newRefreshToken);

            res.json({ accessToken, refreshToken: newRefreshToken });
        }
    );
};

export default refreshToken;
