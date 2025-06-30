// models/projectModel.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  gitRemoteUrl: { type: String },
  projectToken: { type: String, required: true }, // New field

  collaborators: [
    {
      userId: { type: String, required: true }, // GitHub ID here
      role: {
        type: String,
        enum: ["owner", "collaborator"],
        default: "collaborator",
      },
    },
  ],

  environments: [
    {
      profileName: { type: String, required: true },
      encryptedEnvData: { type: String, required: true },
      initializationVector: { type: String, required: true },
      lastSyncedAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Project", projectSchema);
