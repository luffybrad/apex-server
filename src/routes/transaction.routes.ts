// src/routes/transaction.routes.ts
import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import * as transactionController from "../controllers/transaction.controller";

const router = Router();

// All transaction routes require authentication
router.use(authenticateJWT);

// Deposit funds
router.post("/deposit", transactionController.deposit);

// Withdraw funds
router.post("/withdraw", transactionController.withdraw);

// Get transaction history
router.get("/history", transactionController.getTransactions);

// Get current balance
router.get("/balance", transactionController.getBalance);

export default router;
