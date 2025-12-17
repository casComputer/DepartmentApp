import express from "express";

import Notes from "../models/notes.js";
import cloudinary from "../config/cloudinary.js";

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
        const {
            secure_url,
            format,
            size,
            parentId,
            filename,
            teacherId,
            publicId
        } = req.body;

        if (
            !secure_url ||
            !format ||
            !parentId ||
            !size ||
            !filename ||
            !publicId ||
            !teacherId
        )
            return res.json({
                success: false,
                message: "Missing required parameters!"
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
            fileUrl: secure_url,
            format,
            size,
            publicId
        });

        res.json({ success: true, file: newDoc });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

const extractPublicIdFromUrl = url => {
    try {
        if (!url) return null;

        const cleanUrl = url.split("?")[0];
        const parts = cleanUrl.split("/upload/");

        if (parts.length !== 2) return null;
        let publicIdWithExt = parts[1];

        publicIdWithExt = publicIdWithExt.replace(/^v\d+\//, "");

        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");

        return publicId;
    } catch {
        return null;
    }
};

router.post("/delete", async (req, res) => {
    try {
        const { noteIds, teacherId } = req.body;

        if (!Array.isArray(noteIds) || noteIds.length === 0 || !teacherId) {
            return res.json({
                success: false,
                message: "Missing required parameters!"
            });
        }

        const validRoots = await Notes.find(
            { _id: { $in: noteIds }, teacherId },
            { _id: 1, parentId: 1 }
        );

        if (validRoots.length === 0) {
            return res.json({
                success: false,
                message: "No valid notes to delete"
            });
        }

        const idsToDelete = new Set(validRoots.map(r => r._id.toString()));

        for (const id of idsToDelete) {
            const children = await Notes.find({ parentId: id }, { _id: 1 });

            children.forEach(c => idsToDelete.add(c._id.toString()));
        }

        const fileNotes = await Notes.find(
            {
                _id: { $in: [...idsToDelete] },
                type: "file"
            },
            { publicId: 1, fileUrl: 1 }
        );

        // 4️⃣ Collect publicIds (with fallback)
        const publicIds = [];

        for (const file of fileNotes) {
            if (file.publicId) {
                publicIds.push(file.publicId);
            } else {
                const extracted = extractPublicIdFromUrl(file.fileUrl);
                if (extracted) {
                    publicIds.push(extracted);
                }
            }
        }

        // 5️⃣ Delete from Cloudinary
        if (publicIds.length > 0) {
            await cloudinary.api.delete_resources(publicIds, {
                resource_type: "auto"
            });
        }

        // 5️⃣ Delete DB records
        await Notes.deleteMany({
            _id: { $in: [...idsToDelete] }
        });

        res.json({ success: true, validRoots });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ success: false });
    }
});

// student routes

router.post("/fetchByStudent", async (req, res) => {
    try {
        const { course, year, parentId } = req.body;

        if (!course || !year)
            return res.json({
                success: false,
                message: "course and year is required!"
            });

        const notes = await Notes.find({
            parentId,
            course,
            year
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

export default router;
