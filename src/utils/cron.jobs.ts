// src/utils/cron.jobs.ts
import cron from "node-cron";
import { InvestmentService } from "../services/investment.service";

const investmentService = new InvestmentService();

// Run every hour to process completed investments
export const initializeCronJobs = () => {
  // Process completed investments every hour
  cron.schedule("0 * * * *", async () => {
    console.log(
      "🕐 Running cron job: Process completed investments",
      new Date().toISOString(),
    );

    try {
      await investmentService.processCompletedInvestments();
      console.log("✅ Completed investments processed successfully");
    } catch (error) {
      console.error("❌ Failed to process completed investments:", error);
    }
  });

  console.log("✅ Cron jobs initialized");
};
