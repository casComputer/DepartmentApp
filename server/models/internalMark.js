import mongoose from "mongoose";

const schema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },

    course: {
        type: String,
        required: true
    },
    sem: {
        type: String,
        required: true
    },

    teacherId: {
        type: String,
        required: true,
    },

    secure_url: {
        type: String,
        required: true,
    },
    format: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now
        }
    });

    export default mongoose.model("internalMark", schema);