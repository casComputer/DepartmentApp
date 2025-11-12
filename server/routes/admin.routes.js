import express from "express";
import { turso } from "../config/turso.js";

const router = express.Router();

router.get("/teachers", async (req, res) => {
    try {
        console.log("Fetching teachers from database...");
        const result = await turso.execute("SELECT * FROM teachers");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }
);

export default router;
