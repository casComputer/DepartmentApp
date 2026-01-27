import express from "express";

const router = express.Router();

import signupController from "../controllers/auth/signup.controller.js";
import signinController from "../controllers/auth/signin.controller.js";
import { refreshAccessToken } from "../controllers/auth/refresh.controller.js";
import logoutController from "../controllers/auth/logout.controller.js";

router.post("/signin", signinController);

router.post("/signup", signupController);

router.post("/refresh", refreshAccessToken);

router.post("/logout", logoutController);

export default router;
