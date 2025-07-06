import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { envSyncController } from "../controllers/envController.js";
import { projectController } from "../controllers/projectController.js";
const router = Router();

router.post("/push", authMiddleware, envSyncController.push);
router.get("/projects/by-git-url", projectController.getProjectByGitUrl);
router.post("/projects", authMiddleware, projectController.createProject);
router.get(
  "/projects/by-token",
  authMiddleware,
  projectController.getProjectByToken
);

export default router;
