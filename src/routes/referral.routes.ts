// src/routes/referral.routes.ts
import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import * as referralController from "../controllers/referral.controller";

const router = Router();

// Public route - validate referral code
router.get("/validate/:code", referralController.validateReferralCode);

// Protected routes
router.use(authenticateJWT);

// Generate referral link
router.post("/generate", referralController.generateReferralLink);

// Get referral statistics
router.get("/stats", referralController.getReferralStats);

// Get referrals list
router.get("/list", referralController.getReferrals);

// Get referral awards
router.get("/awards", referralController.getReferralAwards);

export default router;
