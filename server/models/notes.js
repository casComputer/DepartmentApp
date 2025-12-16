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
        default: null // root folder
    },

    // path: {
    //     type: String,
    //     index: true
    // },

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
        required: true
    },

    // only for files
    fileUrl: String,
    mimeType: String,
    size: Number,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("notes", notesSchema);
