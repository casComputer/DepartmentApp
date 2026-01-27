import express from "express";
import cors from "cors";

import "./config/mongoose.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import studentRoutes from "./routes/student.routes.js";
import classRoutes from "./routes/class.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import fileRoutes from "./routes/file.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import feesRoutes from "./routes/fees.routes.js";

import data from "./cron/attendance.js";

import {
    authenticateToken,
    authorize
} from "./middleware/authentication.middleware.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors( {
    origin: "*", credentials: true
}));

app.get("/hello", (req, res) => {
    res.send("Department App Server is running");
});

app.use("/auth", authRoutes);
app.use(authenticateToken);
app.use("/admin", authorize("admin"), adminRoutes);

app.use("/attendance", attendanceRoutes);
app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);
app.use("/class", classRoutes);
app.use("/assignment", assignmentRoutes);
app.use("/notes", notesRoutes);
app.use("/file", fileRoutes);
app.use("/profile", profileRoutes);
app.use("/fees", feesRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});