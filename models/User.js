// models/User.js
import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    githubId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    avatarUrl: { type: String },
    location: { type: String },
    name: { type: String },
    email: { type: String },
    createdAt: { type: Date, default: Date.now },
  },

  { timestamps: true }
);

export default mongoose.model("User", userSchema);
