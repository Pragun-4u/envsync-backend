import axios from "axios";
import crypto from "crypto";
import { config } from "../config/config.js";

const key = Buffer.from(config.ENCRYPTION_KEY, "hex");

class AuthService {
  constructor() {
    this.currentUser = null; // Temporary memory storage
  }

  encrypt(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(config.encryptionAlgorithm, key, iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
  }

  decrypt(data) {
    let iv = Buffer.from(data.iv, "hex");
    let encryptedText = Buffer.from(data.encryptedData, "hex");
    let decipher = crypto.createDecipheriv(config.encryptionAlgorithm, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  getGitHubAuthUrl() {
    const { clientId, redirectUri } = config.github;
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
  }

  async exchangeCodeForToken(code) {
    try {
      const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: config.github.clientId,
          client_secret: config.github.clientSecret,
          code,
        },
        { headers: { Accept: "application/json" } }
      );

      return tokenResponse.data.access_token;
    } catch (error) {
      throw new Error(`Failed to exchange code for token: ${error.message}`);
    }
  }

  async getGitHubUser(accessToken) {
    try {
      const userResponse = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `token ${accessToken}` },
      });

      return userResponse.data;
    } catch (error) {
      throw new Error(`Failed to fetch user data: ${error.message}`);
    }
  }

  async authenticateUser(code) {
    const accessToken = await this.exchangeCodeForToken(code);
    const userData = await this.getGitHubUser(accessToken);
    const encryptedToken = this.encrypt(accessToken);

    return { userData, encryptedToken };
  }

  setCurrentUser(user, encryptedToken) {
    this.currentUser = {
      githubId: user.githubId,
      username: user.username,
      avatarUrl: user.avatarUrl,
      name: user.name,
      email: user.email,
      accessToken: encryptedToken,
    };
  }

  getCurrentUser() {
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
  }
}

export default new AuthService();
