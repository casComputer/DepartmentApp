import { revokeRefreshToken } from "../../utils/token.utils.js";

const logout = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(400).json({ message: "No token provided" });

    jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        async (err, user) => {
            if (!err) await revokeRefreshToken(user.userId);
            res.json({ message: "Logged out successfully" });
        }
    );
};

export default logout;
