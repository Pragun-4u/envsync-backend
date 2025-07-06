import UserService from "../services/userService";

export const userController = {
  async create(req, res) {
    try {
      const user = await UserService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
