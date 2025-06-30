import envService from "../services/envService.js";
export const envSyncController = {
  push: async (req, res) => {
    try {
      // Implement your push logic here

      const response = await envService.push(req.body, req.user);
      console.log("Response:", response);
      res.json({ msg: "Pushed successfully" });
    } catch (error) {
      console.error("Error pushing environment variables:", error.message);
      res.status(500).json({ error: "Failed to push environment variables" });
    }
  },
};
