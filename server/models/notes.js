import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["file", "folder"],
        required: true
    },

    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "notes",
        index: true,
        default: null // root folder
    },

    year: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    teacherId: {
        type: String,
        required: true,
        index: true
    },

    // only for files
    fileUrl: String,
    publicId: String,
    format: String,
    size: Number,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("notes", notesSchema);
