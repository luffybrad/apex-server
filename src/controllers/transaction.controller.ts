// src/controllers/transaction.controller.ts
import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/transaction.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { DepositDTO, WithdrawalDTO } from "../dtos/transaction.dto";

const transactionService = new TransactionService();

// ================== DEPOSIT ==================
export const deposit = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input: DepositDTO = req.body;
    const transaction = await transactionService.deposit(req.user!.id, input);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

// ================== WITHDRAW ==================
export const withdraw = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input: WithdrawalDTO = req.body;
    const transaction = await transactionService.withdraw(req.user!.id, input);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

// ================== GET TRANSACTION HISTORY ==================
export const getTransactions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const transactions = await transactionService.getUserTransactions(
      req.user!.id,
      limit,
    );
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

// ================== GET BALANCE ==================
export const getBalance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const balance = await transactionService.getUserBalance(req.user!.id);
    res.json({ balance });
  } catch (error) {
    next(error);
  }
};
