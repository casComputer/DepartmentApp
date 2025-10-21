import express from "express";
import { turso } from "../config/turso.js";

const router = express.Router();

import signupController from "../controllers/auth/signup.controller.js";

router.post("/signin", async (req, res) => {
  const data = req.body;

  console.log(data);

  res.send("Login endpoint");
});

router.post("/signup", signupController);

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
