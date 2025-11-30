import mongoose from "mongoose";

function getYYYYMMDD() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // YYYY-MM-DD
}

const reportSchema = new mongoose.Schema({
    approximateWorkingHours: Number,
    approximateWorkingDays: Number,
    remainingDays: Number,
    remainingHours: Number,

    studentsReport: [
        {
            studentId: {
                type: String,
                index: true
            },
            fullname: String,
            course: String,
            year_of_study: String,
            total_present: Number,
            total_absent: Number,
            total_late: Number,
            total_hours: Number,
            total_days: Number
        }
    ],
    date: {
        type: String,
        default: getYYYYMMDD
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("report", reportSchema);
