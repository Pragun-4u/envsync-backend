// services/projectService.js
import projectModel from "../models/Project.js";
import crypto from "crypto";

class ProjectService {
  async createProject({ projectName, gitRemoteUrl, ownerId }) {
    const projectToken = crypto.randomBytes(32).toString("hex");

    const project = await projectModel.create({
      projectName,
      gitRemoteUrl,
      projectToken,
      collaborators: [
        {
          userId: ownerId,
          role: "owner",
        },
      ],
      environments: [], // Will be filled on push
    });

    return project;
  }

  async findByGitUrl(gitUrl) {
    return await projectModel.findOne({ gitRemoteUrl: gitUrl });
  }
}

export default new ProjectService();
