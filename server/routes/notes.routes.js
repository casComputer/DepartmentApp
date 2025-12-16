import express from "express";

import Notes from "../models/notes.js";

const router = express.Router();

router.post("/fetchByTeacher", async (req, res) => {
    try {
        const { teacherId, parentId } = req.body;

        if (!teacherId)
            return res.json({
                success: false,
                message: "teacher id is required!"
            });

        const notes = await Notes.find({
            parentId,
            teacherId
        });

        res.json({ notes, success: true });
    } catch (error) {
        console.error(error);
        res.send(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
});

router.post("/create", async (req, res) => {
    try {
        const { name, course, year, type, parentId, path, teacherId } =
            req.body;

        if (!name || !course || !year || !type || !path || !teacherId) {
            return res.json({
                success: false,
                message: "Expected parameters were missing!"
            });
        }
        
        const note = await Notes.create({ 
            name, course, year, type, path, parentId, teacherId
        })
        
        res.json({ success: true, note })
        
    } catch (error) {
        console.error(error);
        res.send(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
});

export default router;
