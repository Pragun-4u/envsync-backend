import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    redirectUri:
      process.env.GITHUB_REDIRECT_URI ||
      "http://localhost:3001/auth/github/callback",
  },
  encryptionAlgorithm: process.env.ENCRYPTION_ALGORITHM,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
};
