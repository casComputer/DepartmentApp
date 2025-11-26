import express from "express";
import { turso } from "../config/turso.js";

const router = express.Router();

import signupController from "../controllers/auth/signup.controller.js";
import signinController from "../controllers/auth/signin.controller.js";
import { refreshAccessToken } from "../controllers/auth/refresh.controller.js";
import logoutController from "../controllers/auth/logout.controller.js";

router.post("/signin", signinController);

router.post("/signup", signupController);

router.post("/refresh", refreshAccessToken);

router.post("/logout", logoutController);

router.get("/users", async (req, res) => {
	try {
		const students = await turso.execute(`SELECT * FROM students`);
		const teachers = await turso.execute(`SELECT * FROM teachers`);
		const admins = await turso.execute(`SELECT * FROM admins`);
		const result = {
			students: students.rows,
			teachers: teachers.rows,
			admins: admins.rows,
		};
		res.send(result);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/get", async (req, res) => {
	try {
		const { rows } = await turso.execute(
			"SELECT * FROM attendance ORDER BY date DESC"
		);
		if (rows.length === 0) {
			return res
				.status(404)
				.json({
					message: "No attendance records found",
					success: false,
				});
		}

		res.send(rows);
	} catch (err) {
		console.log("Error while fetching attendence: ", err);
		res.status(500).json({
			message: "Internal server error",
			success: false,
		});
	}
});   

export default router;
