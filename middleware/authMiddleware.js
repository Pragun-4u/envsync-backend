import axios from "axios";
import authService from "../services/authService.js";
import User from "../models/User.js";
import UserService from "../services/userService.js";

const userService = new UserService();

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req?.headers?.["x-auth-token"];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const parsedToken = JSON.parse(token);
    const decryptedToken = authService.decrypt(parsedToken);
    if (!decryptedToken) return res.status(401).json({ error: "Unauthorized" });

    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${decryptedToken}` },
    });

    if (!userRes.data) return res.status(403).json({ error: "Forbidden" });

    const githubId = userRes.data.id;

    // Check if user exists in DB by GitHub ID
    let user = await User.findOne({ githubId });

    // If not found, create the user
    if (!user) {
      const userPayload = {
        githubId: userRes.data.id,
        username: userRes.data.login,
        avatarUrl: userRes.data.avatar_url,
        name: userRes.data.name,
        email: userRes.data.email,
        location: userRes.data.location,
        accessToken: decryptedToken,
      };

      user = await userService.create(userPayload);

      if (!user) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    req.user = {
      id: user._id,
      githubId: user.githubId,
      username: user.username,
      avatarUrl: user.avatarUrl,
      name: user.name,
      email: user.email,
      location: user.location,

      // Optional: attach full GitHub response if old code depends on it
      rawGithubData: userRes.data,
    };

    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
