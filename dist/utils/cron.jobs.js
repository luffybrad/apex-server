"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCronJobs = void 0;
// src/utils/cron.jobs.ts
const node_cron_1 = __importDefault(require("node-cron"));
const investment_service_1 = require("../services/investment.service");
const investmentService = new investment_service_1.InvestmentService();
// Run every hour to process completed investments
const initializeCronJobs = () => {
    // Process completed investments every hour
    node_cron_1.default.schedule("0 * * * *", async () => {
        console.log("🕐 Running cron job: Process completed investments", new Date().toISOString());
        try {
            await investmentService.processCompletedInvestments();
            console.log("✅ Completed investments processed successfully");
        }
        catch (error) {
            console.error("❌ Failed to process completed investments:", error);
        }
    });
    console.log("✅ Cron jobs initialized");
};
exports.initializeCronJobs = initializeCronJobs;
//# sourceMappingURL=cron.jobs.js.map