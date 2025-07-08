// services/projectService.js
import projectModel from "../models/Project.js";
import crypto from "crypto";
import ProjectRepository from "../repository/projectRepository.js";

class ProjectService {
  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async createProject({ projectName, gitRemoteUrl, githubId, userId }) {
    const projectToken = crypto.randomBytes(32).toString("hex");

    const project = await projectModel.create({
      projectName,
      gitRemoteUrl,
      projectToken,
      collaborators: [
        {
          userId: userId,
          role: "owner",
          githubId: githubId,
        },
      ],
      environments: [], // Will be filled on push
    });

    return project;
  }

  async findByProjectToken(projectToken) {
    try {
      return await projectModel.findOne({ projectToken });
    } catch (error) {
      console.log(error);
    }
  }

  async findByProjectId(projectId) {
    try {
      const project = await this.projectRepository.getProjectByProjectId(
        projectId
      );
      return project;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findByGitUrl(gitUrl) {
    try {
      return await projectModel.findOne({ gitRemoteUrl: gitUrl });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new ProjectService();
