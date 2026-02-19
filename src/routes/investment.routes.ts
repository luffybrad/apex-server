// src/routes/investment.routes.ts
import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/auth.middleware";
import * as investmentController from "../controllers/investment.controller";

const router = Router();

// ================== PUBLIC ROUTES (No Auth Required) ==================
// Investment plans - public access for viewing
router.get("/plans", investmentController.getActivePlans);
router.get("/plans/:planId", investmentController.getPlanById);

// ================== PROTECTED ROUTES (Authentication Required) ==================
router.use(authenticateJWT); // All routes below require authentication

// Investment creation and management
router.post("/invest", investmentController.createInvestment);
router.get("/active", investmentController.getActiveInvestments);
router.get("/history", investmentController.getInvestmentHistory);
router.get("/transactions", investmentController.getTransactionHistory);
router.get("/calculate", investmentController.calculateReturns);
router.get("/:investmentId", investmentController.getInvestmentDetails);

// ================== ADMIN ROUTES (Admin Only) ==================
// Initialize default plans
router.post("/admin/init-plans", isAdmin, investmentController.initializePlans);

// Process completed investments (can also be triggered manually by admin)
router.post(
  "/admin/process-completed",
  isAdmin,
  investmentController.processCompletedInvestments,
);

// Admin overview routes
router.get("/admin/all", isAdmin, investmentController.getAllInvestments);
router.get("/admin/stats", isAdmin, investmentController.getInvestmentStats);

export default router;
