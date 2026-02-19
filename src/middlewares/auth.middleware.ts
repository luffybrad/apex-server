// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/app.error";
import { UserRole } from "../models/user.model";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    phoneNumber: string;
    email: string;
    role: UserRole;
  };
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Authorization token missing", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!process.env.JWT_SECRET)
      throw new AppError("JWT secret not defined", 500);

    const payload = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
      phoneNumber: string;
      email: string;
      role: UserRole;
    };

    req.user = payload;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

// Role-based authorization middleware
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to access this resource", 403),
      );
    }

    next();
  };
};

// Specific role middlewares
// Specific role middlewares - Use string literals directly
export const isAdmin = authorize("admin", "super_admin");
export const isSuperAdmin = authorize("super_admin");
