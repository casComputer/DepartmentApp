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
        let { name, course, year, type, parentId, teacherId } = req.body;

        if (!name || !type || !teacherId) {
            return res.json({
                success: false,
                message: "Expected parameters were missing!"
            });
        }

        if (!course || !year) {
            if (!parentId)
                return res.json({
                    success: false,
                    message: "Expected parameters were missing!"
                });

            const exist = await Notes.findById(parentId);

            if (!exist)
                return res.json({
                    success: false,
                    message: "Unable to locate the parent folder!"
                });

            course = exist.course;
            year = exist.year;
        }

        const note = await Notes.create({
            name,
            course,
            year,
            type,
            parentId,
            teacherId
        });

        res.json({ success: true, note });
    } catch (error) {
        console.error(error);
        res.send(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
});

router.post("/upload", async (req, res) => {
    try {
        const { secure_url, format, size, parentId, filename, teacherId } =
            req.body;

        if (
            !secure_url ||
            !format ||
            !parentId ||
            !size ||
            !filename ||
            !teacherId
        )
            return res.json({
                success: false,
                message: "Misign required parameters!"
            });

        const parentDoc = await Notes.findById(parentId);

        if (!parentDoc)
            return res.json({
                success: false,
                message: "Failed to locate parent folder!"
            });

        const newDoc = await Notes.create({
            name: filename,
            type: "file",
            parentId,
            year: parentDoc.year,
            course: parentDoc.course,
            teacherId,
            fileUri: secure_url,
            format,
            size
        });

        res.json({ success: true, file: newDoc });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

export default router;
