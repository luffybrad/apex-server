// src/app.ts
import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import investmentRoutes from "./routes/investment.routes";
import { errorHandler } from "./middlewares/error.handler";
import { AppDataSource } from "./config/data-source";
import { initializeCronJobs } from "./utils/cron.jobs";
import { InvestmentService } from "./services/investment.service";
import referralRoutes from "./routes/referral.routes";
import { apiLimiter, authLimiter } from "./middlewares/rate-limit.middleware";
import transactionRoutes from "./routes/transaction.routes";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:4200", // Your Angular frontend URL
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/transactions", transactionRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Debug route to check plans directly
app.get("/api/debug/plans", async (req, res) => {
  try {
    const investmentService = new InvestmentService();
    const plans = await investmentService.getActivePlans();
    res.json({
      message: "Plans fetched successfully",
      count: plans.length,
      plans,
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Global error handler
app.use(errorHandler);

// Initialize database connection and start server
const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    console.log("✅ Database connected successfully");

    // Initialize default investment plans
    const investmentService = new InvestmentService();
    await investmentService.initializeDefaultPlans();
    console.log("✅ Investment plans initialized");

    // Initialize cron jobs
    initializeCronJobs();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });

export default app;
