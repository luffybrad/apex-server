import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app.error";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Operational / expected errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors ?? undefined,
    });
  }

  // Unknown / programming errors
  console.error(err); // log for developers

  return res.status(500).json({
    message: "Something went wrong. Please try again later.",
  });
}
