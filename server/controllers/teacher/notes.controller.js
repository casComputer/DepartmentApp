import Notes from "../../models/notes.js";
import cloudinary from "../../config/cloudinary.js";

const extractPublicIdFromUrl = (url) => {
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

export const create = async (req, res) => {
    try {
        let { name, course, year, type, parentId } = req.body;
        const { userId: teacherId } = req.user;

        if (!name || !type || !teacherId) {
            return res.json({
                success: false,
                message: "Expected parameters were missing!",
            });
        }

        if (!course || !year) {
            if (!parentId)
                return res.json({
                    success: false,
                    message: "Expected parameters were missing!",
                });

            const exist = await Notes.findById(parentId);

            if (!exist)
                return res.json({
                    success: false,
                    message: "Unable to locate the parent folder!",
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
            teacherId,
        });

        res.json({ success: true, note });
    } catch (error) {
        console.error(error);
        res.send(500).json({
            success: false,
            message: "Internal server error!",
        });
    }
};

export const upload = async (req, res) => {
    try {
        const {
            secure_url,
            format,
            size,
            parentId,
            filename,
            publicId,
        } = req.body;

        const { userId: teacherId } = req.user;

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
                message: "Missing required parameters!",
            });

        const parentDoc = await Notes.findById(parentId);

        if (!parentDoc)
            return res.json({
                success: false,
                message: "Failed to locate parent folder!",
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
            publicId,
        });

        res.json({ success: true, file: newDoc });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const { noteIds } = req.body;

        const { userId: teacherId } = req.user;

        if (!Array.isArray(noteIds) || noteIds.length === 0 || !teacherId) {
            return res.json({
                success: false,
                message: "Missing required parameters!",
            });
        }

        const validRoots = await Notes.find(
            { _id: { $in: noteIds }, teacherId },
            { _id: 1, parentId: 1 },
        );

        if (validRoots.length === 0) {
            return res.json({
                success: false,
                message: "No valid notes to delete",
            });
        }

        const idsToDelete = new Set(validRoots.map((r) => r._id.toString()));

        for (const id of idsToDelete) {
            const children = await Notes.find({ parentId: id }, { _id: 1 });

            children.forEach((c) => idsToDelete.add(c._id.toString()));
        }

        const fileNotes = await Notes.find(
            {
                _id: { $in: [...idsToDelete] },
                type: "file",
            },
            { publicId: 1, fileUrl: 1, format: 1, name: 1 },
        );

        const imageFormats = new Set(["jpg", "jpeg", "png", "webp"]);
        const rawFormats = new Set([
            "pdf",
            "ppt",
            "pptx",
            "doc",
            "docx",
            "xls",
            "xlsx",
        ]);

        const imagePublicIds = [];
        const rawPublicIds = [];

        for (const file of fileNotes) {
            const publicId =
                file.publicId || extractPublicIdFromUrl(file.fileUrl);

            if (!publicId || !file.format) continue;

            const format = file.format.toLowerCase();

            if (imageFormats.has(format)) {
                imagePublicIds.push(publicId);
            } else if (rawFormats.has(format)) {
                rawPublicIds.push(publicId);
            }
        }

        // Delete images
        if (imagePublicIds.length) {
            await cloudinary.api.delete_resources(imagePublicIds, {
                resource_type: "image",
            });
        }

        // Delete pdf/ppt/etc
        if (rawPublicIds.length) {
            await cloudinary.api.delete_resources(rawPublicIds, {
                resource_type: "raw",
            });
        }

        // Delete DB records
        await Notes.deleteMany({
            _id: { $in: [...idsToDelete] },
        });

        res.json({ success: true, validRoots, fileNotes });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ success: false });
    }
};

export const fetchByTeacher = async (req, res) => {
    try {
        const { parentId } = req.body;

        const { userId: teacherId } = req.user;

        if (!teacherId)
            return res.json({
                success: false,
                message: "teacher id is required!",
            });

        const notes = await Notes.find({
            parentId,
            teacherId,
        });

        res.json({ notes, success: true });
    } catch (error) {
        console.error(error);
        res.send(500).json({
            success: false,
            message: "Internal server error!",
        });
    }
};
