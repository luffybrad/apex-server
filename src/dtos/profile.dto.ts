// src/dtos/profile.dto.ts
import {
  IsPhoneNumber,
  IsOptional,
  MinLength,
  Matches,
  IsEmail,
  IsEnum,
} from "class-validator";
import { UserRole } from "../constants/roles"; // Import from constants

export class UpdateProfileDTO {
  @IsOptional()
  @IsPhoneNumber("KE", { message: "Phone number must be in Kenyan format" })
  phoneNumber?: string;

  @IsOptional()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email?: string;

  @IsOptional()
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  password?: string;
}

export class ProfileResponseDTO {
  id!: string;
  phoneNumber!: string;
  email!: string;
  role!: UserRole;
  isEmailVerified!: boolean;
  balance!: number;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<ProfileResponseDTO>) {
    Object.assign(this, partial);
  }
}
