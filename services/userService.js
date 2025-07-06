import UserRepository from "../repository/userRepository.js";

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async create(data) {
    try {
      return await this.userRepository.create(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
export default UserService;
