import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    startMonth: { type: Number, required: true }, // 0-11
    endMonth: { type: Number, required: true }, // 0-11
    startYear: { type: Number, required: true },
    endYear: { type: Number, required: true },
    year: { type: String, required: true }, // Class year
    course: { type: String, required: true },
    xl_url: { type: String, required: true },
    xl_public_id: { type: String, required: true },
    pdf_url: { type: String, required: true },
    pdf_public_id: { type: String, required: true },
    teacherId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("report", reportSchema);
