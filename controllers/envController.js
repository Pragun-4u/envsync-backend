import envService from "../services/envService.js";
import projectService from "../services/projectService.js";

export const envSyncController = {
  push: async (req, res) => {
    try {
      const {
        projectId,
        profileName,
        encryptedEnvData,
        initializationVector,
        salt,
        authTag,
      } = req.body;

      if (
        !projectId ||
        !profileName ||
        !encryptedEnvData ||
        !initializationVector
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const response = await envService.push(
        projectId,
        profileName,
        encryptedEnvData,
        initializationVector,
        salt,
        authTag
      );

      res
        .status(200)
        .json({
          message: "Environment variables pushed successfully",
          response,
        });
    } catch (error) {
      console.error("Error pushing environment variables:", error.message);
      res.status(500).json({ error: "Failed to push environment variables" });
    }
  },

  pull: async (req, res) => {
    try {
      const { projectId, profileName } = req.body;

      if (!projectId || !profileName) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const response = await envService.pull(projectId, profileName);

      res.status(200).json({
        message: "Pulled successfully the environment variables",
        response,
      });
    } catch (error) {
      console.error("Error pulling environment variables:", error.message);
      res.status(500).json({ error: "Failed to pull environment variables" });
    }
  },
};
