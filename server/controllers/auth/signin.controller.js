import { turso } from "../../config/turso.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const sigininController = async(req, res) => {
  const { username, password } = req.body;

    const user = await turso.execute(
        `SELECT * FROM students WHERE username = ?`,
        [username]
    )

    if (!user.rows.length) {
        return res
        .status(400)
        .json({ success: false, error: "Invalid username or password" });
    }


    const validPassword = bcrypt.compareSync(password, user.rows[0].password);

    if (!validPassword) {
        return res
        .status(400)
        .json({ success: false, error: "Invalid username or password" });
    }

    const payload = { username, role: user.rows[0].role };
    let options = { expiresIn: "1m" }

    const accessToken = jwt.sign(
        payload,
        process.env.JWT_ACCESS_TOKEN_SECRET,
        options
    );

    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ success: true, accessToken, refreshToken, data: user.rows[0] });
}  

export default sigininController;