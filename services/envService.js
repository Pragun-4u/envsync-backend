import envRepository from "../repository/envRepository.js";

class EnvService {
  constructor() {
    this.envRepository = envRepository;
  }

  async push(data, user) {
    try {
      // const userData = {
      //   githubId: user.id,
      //   username: user.login,
      //   avatarUrl: user.avatar_url,
      //   name: user.name,
      //   email: user.email,
      // };

      // const res = await this.envRepository.create(userData);

      console.log(data, user, "data");

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new EnvService();
