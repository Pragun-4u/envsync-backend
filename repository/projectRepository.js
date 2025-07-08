import projectModel from "../../server/models/Project.js";
class ProjectRepository {
  constructor() {
    this.projectModel = projectModel;
  }

  async getProjectByProjectId(id) {
    try {
      return await this.projectModel.findById(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default ProjectRepository;
