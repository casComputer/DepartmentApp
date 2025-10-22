import "dotenv/config";
import { turso } from "../../config/turso.js";
import { comparePassword, generateTokens } from "../../utils/auth.utils.js";

const signinController = async (req, res) => {
  try {
    let { username, password, userRole } = req.body;
    userRole = userRole.toLowerCase();
    let existUser = null;

    console.log(userRole);

    if (userRole === "student") {
      existUser = await turso.execute(
        `SELECT * FROM students WHERE studentId = ?`,
        [username]
      );
    } else if (userRole === "teacher") {
      existUser = await turso.execute(
        `SELECT * FROM teachers WHERE teacherId = ?`,
        [username]
      );
    } else if (userRole === "parent") {
      existUser = await turso.execute(
        `SELECT * FROM parents WHERE parentId = ?`,
        [username]
      );
    } else if (userRole === "admin") {
      existUser = await turso.execute(
        `SELECT * FROM admin WHERE adminID = ?`,
        [username]
      );
    }

    if (!existUser.rows.length) {
      return res.status(400).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    const user = existUser.rows[0];

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        error: "Invalid username or password",
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
