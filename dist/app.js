"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const investment_routes_1 = __importDefault(require("./routes/investment.routes"));
const error_handler_1 = require("./middlewares/error.handler");
const data_source_1 = require("./config/data-source");
const cron_jobs_1 = require("./utils/cron.jobs");
const investment_service_1 = require("./services/investment.service");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:4200", // Your Angular frontend URL
    credentials: true,
}));
app.use(express_1.default.json());
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/profile", profile_routes_1.default);
app.use("/api/investments", investment_routes_1.default);
// Health check
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});
// Debug route to check plans directly
app.get("/api/debug/plans", async (req, res) => {
    try {
        const investmentService = new investment_service_1.InvestmentService();
        const plans = await investmentService.getActivePlans();
        res.json({
            message: "Plans fetched successfully",
            count: plans.length,
            plans,
        });
    }
    catch (error) {
        res.status(500).json({ error: String(error) });
    }
});
// Global error handler
app.use(error_handler_1.errorHandler);
// Initialize database connection and start server
const PORT = process.env.PORT || 3000;
data_source_1.AppDataSource.initialize()
    .then(async () => {
    console.log("✅ Database connected successfully");
    // Initialize default investment plans
    const investmentService = new investment_service_1.InvestmentService();
    await investmentService.initializeDefaultPlans();
    console.log("✅ Investment plans initialized");
    // Initialize cron jobs
    (0, cron_jobs_1.initializeCronJobs)();
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
exports.default = app;
//# sourceMappingURL=app.js.map