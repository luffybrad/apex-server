// src/routes/auth.routes.ts
import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

// Public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);

export default router;
