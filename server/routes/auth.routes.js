import express from "express";
import { turso } from "../config/turso.js";

const router = express.Router();

import signupController from "../controllers/auth/signup.controller.js";
import signinController from "../controllers/auth/signin.controller.js";
import refreshController from "../controllers/auth/refresh.controller.js"
import logoutController from "../controllers/auth/logout.controller.js"

router.post("/signin", signinController);

router.post("/signup", signupController);

router.post('/refresh', refreshController)

router.post("/logout", logoutController);

router.get("/users", async (req, res) => {
  try {
    const result = await turso.execute(`SELECT * FROM students`);
    res.send(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
