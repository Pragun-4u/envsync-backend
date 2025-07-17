import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  gitRemoteUrl: { type: String },
  projectToken: { type: String, required: true },

  collaborators: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      githubId: { type: String, required: true },
      role: {
        type: String,
        enum: ["owner", "collaborator"],
        default: "collaborator",
      },
      _id: false,
    },
  ],

  environments: [
    {
      profileName: { type: String, required: true },
      encryptedEnvData: { type: String, required: true },
      initializationVector: { type: String, required: true },
      salt: { type: String, required: true },
      authTag: { type: String, required: true },
      lastSyncedAt: { type: Date, default: Date.now },
      _id: false,
    },
  ],
});

export default mongoose.model("Project", projectSchema);
