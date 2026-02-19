// src/controllers/investment.controller.ts
import { Request, Response, NextFunction } from "express";
import { InvestmentService } from "../services/investment.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { CreateInvestmentDTO } from "../dtos/investment.dto";

const investmentService = new InvestmentService();

// ================== INITIALIZE DEFAULT PLANS ==================
export const initializePlans = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await investmentService.initializeDefaultPlans();
    res.json({ message: "Default investment plans initialized successfully" });
  } catch (error) {
    next(error);
  }
};

// ================== GET ALL ACTIVE PLANS ==================
export const getActivePlans = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const plans = await investmentService.getActivePlans();
    res.json(plans);
  } catch (error) {
    next(error);
  }
};

// ================== GET PLAN BY ID ==================
export const getPlanById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { planId } = req.params;
    const plan = await investmentService.getPlanById(planId);
    res.json(plan);
  } catch (error) {
    next(error);
  }
};

// ================== CREATE NEW INVESTMENT ==================
export const createInvestment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input: CreateInvestmentDTO = req.body;
    const investment = await investmentService.createInvestment(
      req.user!.id,
      input,
    );
    res.status(201).json(investment);
  } catch (error) {
    next(error);
  }
};

// ================== GET USER'S ACTIVE INVESTMENTS ==================
export const getActiveInvestments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const investments = await investmentService.getUserActiveInvestments(
      req.user!.id,
    );
    res.json(investments);
  } catch (error) {
    next(error);
  }
};

// ================== GET USER'S INVESTMENT HISTORY ==================
export const getInvestmentHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const history = await investmentService.getUserInvestmentHistory(
      req.user!.id,
    );
    res.json(history);
  } catch (error) {
    next(error);
  }
};

// ================== GET INVESTMENT DETAILS ==================
export const getInvestmentDetails = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { investmentId } = req.params;
    const investment = await investmentService.getInvestmentDetails(
      investmentId,
      req.user!.id,
    );
    res.json(investment);
  } catch (error) {
    next(error);
  }
};

// ================== GET USER'S TRANSACTION HISTORY ==================
export const getTransactionHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const transactions = await investmentService.getUserTransactions(
      req.user!.id,
      limit,
    );
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

// ================== CALCULATE POTENTIAL RETURNS ==================
export const calculateReturns = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { amount, planId } = req.query;

    if (!amount || !planId) {
      return res
        .status(400)
        .json({ message: "Amount and planId are required" });
    }

    const returns = await investmentService.calculatePotentialReturns(
      Number(amount),
      planId as string,
    );
    res.json(returns);
  } catch (error) {
    next(error);
  }
};

// ================== ADMIN: PROCESS COMPLETED INVESTMENTS (CRON JOB ENDPOINT) ==================
export const processCompletedInvestments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // This should be protected by admin middleware or a secret key
    await investmentService.processCompletedInvestments();
    res.json({ message: "Completed investments processed successfully" });
  } catch (error) {
    next(error);
  }
};

// ================== ADMIN: GET ALL INVESTMENTS (ADMIN ONLY) ==================
export const getAllInvestments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // This would need an admin service method
    // For now, returning a placeholder
    res.json({ message: "Admin endpoint - to be implemented" });
  } catch (error) {
    next(error);
  }
};

// ================== ADMIN: GET INVESTMENT STATISTICS ==================
export const getInvestmentStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // This would need an admin service method
    // For now, returning a placeholder
    res.json({ message: "Admin endpoint - to be implemented" });
  } catch (error) {
    next(error);
  }
};
