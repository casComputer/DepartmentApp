import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    topic: String,
    description: String,

    year: String,
    course: String,
    teacherId: String,

    strength: Number,
    submissions: [
        {
            studentId: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },

            public_key: String,

            status: {
                type: String,
                default: "pending",
                enum: ["pending", "accepted", "rejected"]
            },
            rejectionMessage: String,
            format: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    dueDate: Date,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("assignment", assignmentSchema);
