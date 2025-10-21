import "dotenv/config";
import { turso } from "../../config/turso.js";
import { comparePassword, generateTokens } from "./authUtils.js";

const signinController = async (req, res) => {
    try {
        const { username, password } = req.body;

        const userResult = await turso.execute(
            `SELECT * FROM students WHERE username = ?`,
            [username]
        );
        if (!userResult.rows.length) {
            return res
                .status(400)
                .json({
                    success: false,
                    error: "Invalid username or password"
                });
        }

        const user = userResult.rows[0];

        const validPassword = await comparePassword(password, user.password);
        if (!validPassword) {
            return res
                .status(400)
                .json({
                    success: false,
                    error: "Invalid username or password"
                });
        }

        const tokens = generateTokens(username, user.role);

        res.json({ success: true, ...tokens, data: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

export default signinController;
