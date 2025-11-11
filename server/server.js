import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors('*'))
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
