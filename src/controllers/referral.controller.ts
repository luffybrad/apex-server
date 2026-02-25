// src/controllers/referral.controller.ts
import { Request, Response, NextFunction } from "express";
import { ReferralService } from "../services/referral.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { GenerateReferralLinkDTO } from "../dtos/referral.dto";

const referralService = new ReferralService();

// ================== GENERATE REFERRAL LINK ==================
export const generateReferralLink = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { customCode }: GenerateReferralLinkDTO = req.body;
    const result = await referralService.generateReferralLink(
      req.user!.id,
      customCode,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// ================== GET REFERRAL STATS ==================
export const getReferralStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await referralService.getReferralStats(req.user!.id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// ================== GET REFERRALS LIST ==================
export const getReferrals = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const referrals = await referralService.getUserReferrals(req.user!.id);
    res.json(referrals);
  } catch (error) {
    next(error);
  }
};

// ================== GET REFERRAL AWARDS ==================
export const getReferralAwards = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const awards = await referralService.getReferralAwards(req.user!.id);
    res.json(awards);
  } catch (error) {
    next(error);
  }
};

// ================== VALIDATE REFERRAL CODE (PUBLIC) ==================
export const validateReferralCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { code } = req.params;
    const result = await referralService.getReferralByCode(code);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
