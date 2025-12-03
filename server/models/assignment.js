import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  topic: String,
  description: String,
  year: String,
  course: String,
  teacherId: String,
  dueDate: Date,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("assignment", assignmentSchema);
