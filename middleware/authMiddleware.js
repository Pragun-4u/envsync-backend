import axios from "axios";
import authService from "../services/authService.js";

export const authMiddleware = async (req, res, next) => {
  try {
    console.log(req.headers, "headers");
    const token = req?.headers?.["x-auth-token"];

    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const parsedToken = JSON.parse(token);

    const decryptedToken = authService.decrypt(parsedToken);
    if (!decryptedToken) return res.status(401).json({ error: "Unauthorized" });

    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${decryptedToken}` },
    });

    if (!userRes.data) return res.status(403).json({ error: "Forbidden" });

    req.user = userRes.data;
    next();
  } catch (error) {
    console.log("Error in authMiddleware:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
