// src/utils/app.error.ts
export class AppError extends Error {
  public statusCode: number;
  public errors?: Record<string, string[]>; // Field-specific errors
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode = 400,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    // Capture proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
