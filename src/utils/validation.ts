import { validate } from "class-validator";
import { AppError } from "./app.error";

export async function validateDTO(dto: any) {
  const errors = await validate(dto);
  if (errors.length) {
    const formatted: Record<string, string[]> = {};
    errors.forEach(err => {
      if (err.constraints) formatted[err.property] = Object.values(err.constraints);
    });
    throw new AppError("Validation failed", 400, formatted);
  }
}
