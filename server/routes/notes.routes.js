import express from "express";

import Notes from "../models/notes.js";

const router = express.Router();

router.post("/fetchByTeacher", async (req, res) => {
    try {
        const { teacherId } = req.body
        
        if(!teacherId) return res.json({ success: false, message: 'teacher id is required!'})
        
        const notes = await Notes.find({
            parentId: null,
            teacherId
        });
        
        res.json({ notes, success: true})
    } catch (error) {
        console.error(error);
        res.send(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
});

export default router;
