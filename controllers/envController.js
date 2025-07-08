import envService from "../services/envService.js";
import projectService from "../services/projectService.js";
export const envSyncController = {
  push: async (req, res) => {
    try {
      const { projectId, profileName, encryptedEnvData, initializationVector } =
        req.body;

      if (
        !projectId ||
        !profileName ||
        !encryptedEnvData ||
        !initializationVector
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const project = await projectService.findByProjectId(projectId);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      if (
        !project.collaborators.some(
          (collab) => collab.userId.toString() === req.user.id.toString()
        )
      ) {
        return res
          .status(403)
          .json({ error: "You are not a collaborator on this project" });
      }

      const environment = project.environments.find(
        (env) => env.profileName === profileName
      );

      if (environment) {
        environment.encryptedEnvData = encryptedEnvData;
        environment.initializationVector = initializationVector;
        environment.lastSyncedAt = new Date();
      } else {
        project.environments.push({
          profileName,
          encryptedEnvData,
          initializationVector,
        });
      }
      const response = await project.save();

      // Implement your push logic here

      console.log("Response:", response);
      res.json({ msg: "Pushed successfully" });
    } catch (error) {
      console.error("Error pushing environment variables:", error.message);
      res.status(500).json({ error: "Failed to push environment variables" });
    }
  },
};
