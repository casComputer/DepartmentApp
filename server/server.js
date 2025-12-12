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

import data from "./cron/attendance.js";

import { authenticateToken } from "./middleware/authentication.middleware.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

app.use("/auth", authRoutes);
app.use(authenticateToken);
app.use("/admin", adminRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);
app.use("/class", classRoutes);
app.use("/assignment", assignmentRoutes);
app.use("/notes", notesRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
