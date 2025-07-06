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

      const { id: userId, githubId } = req.user;

      if (!projectName) {
        return res.status(400).json({ error: "Project name is required." });
      }

      const project = await projectService.createProject({
        projectName,
        gitRemoteUrl,
        githubId: githubId,
        userId: userId,
      });

      console.log({ project }, "controller");
      res.status(201).json({
        projectId: project._id,
        projectToken: project.projectToken,
      });
    } catch (error) {
      console.error("Error creating project:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getProjectByToken: async (req, res) => {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ error: "Project token is required." });
      }

      const project = await projectService.findByProjectToken(token);

      if (!project) {
        return res.status(404).json({ error: "Project not found." });
      }

      console.log("project collaborators", project.collaborators, req.user);
      // Optional: Check if the user is a collaborator
      const isCollaborator = project.collaborators.some(
        (collab) => collab.userId.toString() === req.user.id.toString()
      );
      console.log("isCollaborator", isCollaborator);
      if (!isCollaborator) {
        return res
          .status(403)
          .json({ error: "You are not a collaborator on this project." });
      }

      return res.status(200).json({
        projectId: project._id,
        gitRemoteUrl: project.gitRemoteUrl,
        defaultProject: project.projectName,
        defaultProfile: project.environments[0]?.profileName || null,
        projects: {
          [project.projectName]: project.environments.reduce((acc, env) => {
            acc[env.profileName] = null; // placeholder since env files aren't fetched here
            return acc;
          }, {}),
        },
      });
    } catch (error) {
      console.error("Error fetching project by token:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
