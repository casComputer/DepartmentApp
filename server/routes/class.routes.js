import express from "express";
import { turso } from "../config/turso.js";

const router = express.Router();

router.get("/allClassDetails", async (req, res) => {
    try {
        const result = await turso.execute("SELECT * FROM classes");
        res.json({ classes: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal error", success: false });
    }
});

export default router;
