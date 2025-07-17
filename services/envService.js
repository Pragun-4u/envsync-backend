import envRepository from "../repository/envRepository.js";
import projectService from "./projectService.js";

class EnvService {
  constructor() {
    this.envRepository = envRepository;
  }

  async push(data, user) {
    try {
      const {
        projectId,
        profileName,
        encryptedEnvData,
        initializationVector,
        salt,
        authTag,
      } = data;
      const project = await projectService.findByProjectId(projectId);

      if (!project) {
        throw new Error("Project not found");
      }

      if (
        !project.collaborators.some(
          (collab) => collab.userId.toString() === req.user.id.toString()
        )
      ) {
        throw new Error("You are not a collaborator on this project");
      }

      const environment = project.environments.find(
        (env) => env.profileName === profileName
      );

      if (environment) {
        environment.encryptedEnvData = encryptedEnvData;
        environment.initializationVector = initializationVector;
        environment.salt = salt;
        environment.authTag = authTag;
        environment.lastSyncedAt = new Date();
      } else {
        project.environments.push({
          profileName,
          encryptedEnvData,
          initializationVector,
          salt,
          authTag,
        });
      }

      const response = await project.save();

      if (!response) {
        throw new Error("Failed to save environment variables");
      }

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async pull(data) {
    try {
      const { projectId, profileName } = data;
      console.log({ projectId, profileName });
      const project = await projectService.findByProjectId(projectId);

      if (!project) {
        throw new Error("Project not found");
      }

      if (
        !project.collaborators.some(
          (collab) => collab.userId.toString() === req.user.id.toString()
        )
      ) {
        throw new Error("You are not a collaborator on this project");
      }

      const environment = project.environments.find(
        (env) => env.profileName === profileName
      );

      if (!environment) {
        throw new Error("Environment not found");
      }

      const { encryptedEnvData, initializationVector, salt, authTag } =
        environment;

      return {
        encryptedEnvData,
        initializationVector,
        salt,
        authTag,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new EnvService();
