import "dotenv/config";

import { turso } from "../../config/turso.js";
import { comparePassword } from "../../utils/auth.utils.js";
import { generateTokens } from "../../utils/token.utils.js";

const signinController = async (req, res) => {
  try {
    let { username, password, userRole } = req.body;
    userRole = userRole.toLowerCase();

    const tableMap = {
      student: "students",
      teacher: "teachers",
      parent: "parents",
      admin: "admins",
    };

    const table = tableMap[userRole];

    if (!table) {
      return res.status(400).json({
        success: false,
        error: "Invalid user role",
      });
    }

    let existUser = null;

    if (table === "teachers") {
      existUser = await turso.execute(
        `
               SELECT 
               t.*,
                c.course as in_charge_course,
                c.year as in_charge_year,
                tc.course_name,
                tc.year,
                tc.course

               FROM teachers t 

               LEFT JOIN classes c ON c.in_charge = t.teacherId
               
               RIGHT JOIN teacher_courses tc ON tc.teacherId = t.teacherId
               
               WHERE t.teacherId = ?`,
        [username],
      );

      existUser.rows = [{
        fullname: existUser.rows[0]?.fullname,
        teacherId: existUser.rows[0]?.teacherId,
        dp: existUser.rows[0]?.dp,
        dp_public_id: existUser.rows[0]?.dp_public_id,
        email: existUser.rows[0]?.email,
        phone: existUser.rows[0]?.phone,
        about: existUser.rows[0]?.about,
        is_verified: existUser.rows[0]?.is_verified,
        password: existUser.rows[0]?.password,

        in_charge_course: existUser.rows[0]?.in_charge_course,
        in_charge_year: existUser.rows[0]?.in_charge_year,

        courses: existUser.rows?.map((row) => ({
          year: row.year,
          course: row.course,
          course_name: row.course_name,
        })),
      }]

    } else {
      existUser = await turso.execute(
        `SELECT * FROM ${table} WHERE ${table.slice(0, -1)}Id = ?`,
        [username],
      );
    }

    if (!existUser.rows.length) {
      return res.status(400).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    let user = existUser.rows[0];

    console.log(user)

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    const idKey = {
      student: "studentId",
      teacher: "teacherId",
      parent: "parentId",
      admin: "adminId",
    }[userRole];

    delete user.password;
    user.userId = user[idKey];
    user.role = userRole;

    const tokens = generateTokens(user.userId, user.role);
    // await storeRefreshToken(user.userId, tokens.refreshToken);

    res.json({
      success: true,
      ...tokens,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export default signinController;
