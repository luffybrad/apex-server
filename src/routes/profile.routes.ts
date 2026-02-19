// src/routes/profile.routes.ts
import { Router } from "express";
import { getProfile, updateProfile, deleteProfile } from "../controllers/profile.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

// Protected routes
router.get("/me", authenticateJWT, getProfile);
router.put("/me", authenticateJWT, updateProfile);
router.delete("/me", authenticateJWT, deleteProfile);

export default router;
