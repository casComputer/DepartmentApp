import "dotenv/config";
import { turso } from "../../config/turso.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import validateFields from "./validateSignupFields.js";

const signupController = async (req, res) => {
  let { username, password, fullName, userRole, course, year } = req.body;
  let isSuccess = false;

  // check for missing or invalid fields
  validateFields(req.body, res);

  const existUser = await turso.execute(
    `SELECT * FROM students WHERE username = ?`,
    [username]
  );
  if (existUser.rows.length) {
    return res
      .status(400)
      .json({ success: false, error: "Username already exists" });
  }

  // hash the password
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  password = bcrypt.hashSync(password, salt);

  if (userRole === "student") {
    turso
      .execute(
        `INSERT INTO students (username, fullname, password, role, course, year_of_study) VALUES (?, ?, ?, ?, ?, ?)`,
        [username, fullName, password, userRole, course, year]
      )
      .then(() => {
        console.log("Student inserted successfully");
        const payload = { username, role: userRole };
        let options = { expiresIn: "1m" };

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
        res.json({ success: true, accessToken, refreshToken, data: req.body });
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    turso
      .execute(
        `INSERT INTO students (username, fullname, password, role) VALUES (?, ?, ?, ?)`,
        [username, fullName, password, userRole]
      )
      .then(() => {
        console.log("User inserted successfully");
        const payload = { username, role: userRole };
        let options = { expiresIn: "1m" };

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
        res.json({ success: true, accessToken, refreshToken, data: req.body });
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

export default signupController;
