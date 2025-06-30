// controllers/projectController.js
import projectService from "../services/projectService.js";

export const projectController = {
  getProjectByGitUrl: async (req, res) => {
    try {
      const { gitUrl } = req.query;

      if (!gitUrl) {
        return res
          .status(400)
          .json({ error: "gitUrl query param is required" });
      }

      const project = await projectService.findByGitUrl(gitUrl);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json({
        projectId: project._id,
        projectName: project.projectName,
        gitRemoteUrl: project.gitRemoteUrl,
        defaultProfile: project.defaultProfile,
        projects: project.projects, // Optional if you want to send local mappings
      });
    } catch (error) {
      console.error("Error fetching project:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  createProject: async (req, res) => {
    try {
      const { projectName, gitRemoteUrl } = req.body;

      if (!projectName) {
        return res.status(400).json({ error: "Project name is required." });
      }

      const project = await projectService.createProject({
        projectName,
        gitRemoteUrl,
        ownerId: req.user.id, // GitHub ID from authMiddleware
      });

      res.status(201).json({
        projectId: project._id,
        projectToken: project.projectToken,
      });
    } catch (error) {
      console.error("Error creating project:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
