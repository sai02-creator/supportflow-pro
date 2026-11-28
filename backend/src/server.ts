
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import roleRoutes from "./routes/role.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
const app = express();
const PORT = Number(process.env.PORT) || 5050;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/tickets", ticketRoutes);

// API health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "SupportFlow Pro API is running",
    timestamp: new Date().toISOString(),
  });
});

// Database health check
app.get("/api/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "Database connection successful",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(503).json({
      success: false,
      message: "Database connection unavailable",
    });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`SupportFlow Pro API running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log("Shutting down server...");

  server.close(async () => {
    await prisma.$disconnect();
    console.log("Database connection closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
