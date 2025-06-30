import User from "../models/User.js";
class EnvRepository {
  async create(data) {
    try {
      const res = await User.create(data);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new EnvRepository();
