// src/controllers/profile.controller.ts
import { Request, Response, NextFunction } from "express";
import { ProfileService } from "../services/profile.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { UpdateProfileDTO } from "../dtos/profile.dto";

const profileService = new ProfileService();

// ================== GET PROFILE ==================
export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const profile = await profileService.getProfile(req.user!.id);
  res.json(profile);
};

// ================== UPDATE PROFILE ==================
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const input: UpdateProfileDTO = req.body;
  const updatedProfile = await profileService.updateProfile(req.user!.id, input);
  res.json(updatedProfile);
};

// ================== DELETE PROFILE ==================
export const deleteProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const result = await profileService.deleteProfile(req.user!.id);
  res.json(result);
};
