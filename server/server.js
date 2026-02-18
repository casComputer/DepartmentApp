import express from "express";
import cors from "cors";

import "./config/mongoose.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
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
import dashboardRoutes from "./routes/dashboard.routes.js";
import parentRoutes from "./routes/parent.routes.js"

import {
    authenticateToken,
    authorize,
} from "./middleware/authentication.middleware.js";
import {
    checkHealth,
    isServerRunning
} from "./controllers/server.controller.js";
import { apiLimiter, adminLimiter } from "./middleware/ratelimit.middleware.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(
    cors({
        origin: "*",
        credentials: true,
    }),
);

app.set("trust proxy", 1);

// app.use(apiLimiter);

app.get("/", isServerRunning);

app.use("/auth", authRoutes);
app.use(authenticateToken);
app.use("/user", userRoutes);
// app.get("/health", authorize("admin"), adminLimiter, checkHealth);
// app.use("/admin", authorize("admin"), adminLimiter, adminRoutes);
// app.use("/dashboard", authorize("admin"), adminLimiter, dashboardRoutes);
app.get("/health", authorize("admin"), checkHealth);
app.use("/admin", authorize("admin"), adminRoutes);
app.use("/dashboard", authorize("admin"), dashboardRoutes);

app.use("/attendance", attendanceRoutes);
app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);
app.use("/parent", parentRoutes);
app.use("/class", classRoutes);
app.use("/assignment", assignmentRoutes);
app.use("/notes", notesRoutes);
app.use("/file", fileRoutes);
app.use("/profile", profileRoutes);
app.use("/fees", feesRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
        success: false,
    });
});

app.use((err, req, res, next) => {
    const errorResponse = {
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "Internal server error"
                : err.message
    };

    res.status(err.status || 500).json(errorResponse);
});

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// ✅ Export for Vercel
export default app;
