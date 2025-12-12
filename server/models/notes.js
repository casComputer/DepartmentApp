import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,

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
    
    timestamp: {
        type: Date,
        default: Date.now
    }
})