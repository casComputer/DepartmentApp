import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    calendarMonth: {
        type: String,
        required: true
    },
    calendarYear: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    xl_url: {
        type: String,
        required: true
    },
    xl_public_id: {
        type: String,
        required: true
    },
    pdf_url: {
        type: String,
        required: true
    },
    pdf_public_id: {
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
});

export default mongoose.model("report", reportSchema);
