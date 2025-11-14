import express from "express";
import { turso } from "../config/turso.js";

const router = express.Router();

router.get("/teachers", async (req, res) => {
    try {
        const result = await turso.execute("SELECT teacherId, fullname, is_verified, is_in_charge, in_charge_class, in_charge_year FROM teachers");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }
);
router.post("/assignClass", async (req, res) => {
    try {
        const { course, year, teacherId } = req.body

        await turso.execute(
            `UPDATE teachers SET in_charge_class = ?, in_charge_year = ?, is_in_charge = TRUE WHERE teacherId = ?`,
            [course, year, teacherId]
        );
        
        res.json({ message: "Class assigned successfully", success: true });
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }
);

router.push("/verifyTeacher", async (req, res) =>{
    const { teacherId} = req.body 

    await turso.execute(`update teachers set is_verified `)
})
export default router;
