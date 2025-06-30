import { Router } from "express";
import { authController } from "../controllers/authController.js";
const router = Router();

// GitHub OAuth routes
router.get("/github", authController.redirectToGitHub);
router.get("/github/callback", authController.handleGitHubCallback);

// User routes
router.get("/me", authController.getCurrentUser);
router.get("/logout", authController.logout);

export default router;
