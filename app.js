import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import envRoutes from "./routes/envRoutes.js";
import { config } from "./config/config.js";
import { errorHandler } from "./middleware/errorhandler.js";
import { connectDB } from "./config/db.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to MongoDB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/service", envRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`✅ Auth server running at http://localhost:${config.port}`);
});

export default app;
