import jwt from "jsonwebtoken";
import { AppError } from "./app.error";

export function generateToken(payload: object): string {
  if (!process.env.JWT_SECRET) throw new AppError("JWT secret not defined", 500);
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
}
