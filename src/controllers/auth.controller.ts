// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import {
  SignupDTO,
  LoginDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  VerifyEmailDTO,
} from "../dtos/auth.dto";

const authService = new AuthService();

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input: SignupDTO = req.body;
    const user = await authService.signup(input);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input: LoginDTO = req.body;
    const user = await authService.login(input);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input: ForgotPasswordDTO = req.body;
    const result = await authService.forgotPassword(input);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.params;
    const input: ResetPasswordDTO = req.body;
    const result = await authService.resetPassword(token, input);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input: VerifyEmailDTO = req.body;
    const result = await authService.verifyEmail(input);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const result = await authService.resendVerificationEmail(email);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
