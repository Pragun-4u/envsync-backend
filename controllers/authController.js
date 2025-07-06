import authService from "../services/authService.js";
import User from "../models/User.js";

export const authController = {
  // Redirect to GitHub OAuth
  redirectToGitHub: (req, res) => {
    const authUrl = authService.getGitHubAuthUrl();
    res.redirect(authUrl);
  },

  // Handle GitHub OAuth callback
  handleGitHubCallback: async (req, res) => {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("No authorization code provided");
    }

    try {
      // 1. Authenticate with GitHub
      const { userData, encryptedToken } = await authService.authenticateUser(
        code
      );

      // 2. Check if user exists in DB
      let user = await User.findOne({ githubId: userData.id });

      if (!user) {
        user = await User.create({
          githubId: userData.id,
          username: userData.login,
          avatarUrl: userData.avatar_url,
          name: userData.name,
          email: userData.email,
          location: userData.location,
        });
      }

      // 3. Store encrypted token temporarily for polling (in-memory or Redis, not just in the authService instance)
      authService.setCurrentUser({ user, encryptedToken });

      // 4. Return success page
      res.send(`
        <h2>✅ Logged in as ${user.username}</h2>
        <p>You can now return to your terminal.</p>
      `);
    } catch (error) {
      console.error("Authentication error:", error.message);
      res.status(500).send("Login failed.");
    }
  },

  // Called by CLI polling
  getCurrentUser: (req, res) => {
    const userSession = authService.getCurrentUser();
    if (userSession) {
      return res.json(userSession);
    } else {
      return res.status(401).json({ error: "No user logged in yet." });
    }
  },

  // CLI logout
  logout: (req, res) => {
    try {
      authService.logout();
      res.status(200).json({ msg: "Logged out." });
    } catch (error) {
      res.status(500).json({ error: "Logout failed." });
    }
  },
};
