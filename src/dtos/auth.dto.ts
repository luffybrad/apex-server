// src/dtos/auth.dto.ts
import {
  IsPhoneNumber,
  MinLength,
  Matches,
  IsEmail,
  IsOptional,
  IsEnum,
} from "class-validator";
import { UserRole } from "../models/user.model";

export class SignupDTO {
  @IsPhoneNumber("KE", { message: "Phone number must be in Kenyan format" })
  phoneNumber!: string;

  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;

  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  password!: string;
}

export class LoginDTO {
  @IsPhoneNumber("KE", { message: "Phone number must be in Kenyan format" })
  phoneNumber!: string;

  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  password!: string;
}

export class ForgotPasswordDTO {
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;
}

export class ResetPasswordDTO {
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  newPassword!: string;

  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  confirmPassword!: string;
}

export class VerifyEmailDTO {
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;

  token!: string;
}

export class AuthResponseDTO {
  id!: string;
  phoneNumber!: string;
  email!: string;
  role!: UserRole;
  createdAt!: Date;
  balance!: number;
  updatedAt!: Date;
  token?: string;

  constructor(partial: Partial<AuthResponseDTO>) {
    Object.assign(this, partial);
  }
}

export class AdminCreateUserDTO {
  @IsPhoneNumber("KE", { message: "Phone number must be in Kenyan format" })
  phoneNumber!: string;

  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;

  @MinLength(8, { message: "Password must be at least 8 characters" })
  password!: string;

  @IsOptional()
  role?: UserRole;
}
