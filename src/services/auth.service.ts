// src/services/auth.service.ts
import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User, UserRole } from "../models/user.model";
import { AppError } from "../utils/app.error";
import {
  AuthResponseDTO,
  LoginDTO,
  SignupDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  VerifyEmailDTO,
} from "../dtos/auth.dto";
import { AppDataSource } from "../config/data-source";
import { plainToInstance } from "class-transformer";
import { validateDTO } from "../utils/validation";
import { generateToken } from "../utils/jwt";
import { EmailService } from "../utils/email.service";

export class AuthService {
  private userRepo: Repository<User>;
  private emailService: EmailService;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
    this.emailService = new EmailService();
  }

  async signup(input: SignupDTO): Promise<AuthResponseDTO> {
    const dto = plainToInstance(SignupDTO, input);
    await validateDTO(dto);

    // Check if user already exists by phone or email
    const existingUser = await this.userRepo.findOne({
      where: [{ phoneNumber: input.phoneNumber }, { email: input.email }],
    });

    if (existingUser) {
      if (existingUser.phoneNumber === input.phoneNumber) {
        throw new AppError("Phone number already registered", 400);
      }
      if (existingUser.email === input.email) {
        throw new AppError("Email already registered", 400);
      }
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    // Save user
    const user = this.userRepo.create({
      phoneNumber: input.phoneNumber,
      email: input.email,
      password: input.password,
      role: UserRole.USER,
      emailVerificationToken,
    });

    const savedUser = await this.userRepo.save(user);

    // Send verification email
    await this.emailService.sendEmailVerification(
      savedUser.email,
      emailVerificationToken,
    );

    // Generate JWT
    const token = generateToken({
      id: savedUser.id,
      phoneNumber: savedUser.phoneNumber,
      email: savedUser.email,
      role: savedUser.role,
    });

    // Send welcome email
    await this.emailService.sendWelcomeEmail(
      savedUser.email,
      savedUser.phoneNumber,
    );

    return new AuthResponseDTO({
      id: savedUser.id,
      phoneNumber: savedUser.phoneNumber,
      email: savedUser.email,
      role: savedUser.role,
      balance: savedUser.balance,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
      token,
    });
  }

  async login(input: LoginDTO): Promise<AuthResponseDTO> {
    const dto = plainToInstance(LoginDTO, input);
    await validateDTO(dto);

    // Find user in DB
    const user = await this.userRepo.findOne({
      where: { phoneNumber: input.phoneNumber },
      select: [
        "id",
        "phoneNumber",
        "email",
        "password",
        "role",
        "balance",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = generateToken({
      id: user.id,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
    });

    return new AuthResponseDTO({
      id: user.id,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
      balance: user.balance,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token,
    });
  }

  async forgotPassword(input: ForgotPasswordDTO): Promise<{ message: string }> {
    await validateDTO(input);

    const user = await this.userRepo.findOne({ where: { email: input.email } });

    if (!user) {
      // Don't reveal if user exists
      return {
        message:
          "If your email is registered, you will receive a password reset link",
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await this.userRepo.save(user);

    // Send reset email
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: "Password reset email sent successfully" };
  }

  async resetPassword(
    token: string,
    input: ResetPasswordDTO,
  ): Promise<{ message: string }> {
    await validateDTO(input);

    if (input.newPassword !== input.confirmPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    const user = await this.userRepo.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() } as any,
      },
    });

    if (!user) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    user.password = input.newPassword;
    user.resetPasswordToken = null!;
    user.resetPasswordExpires = null!;
    await this.userRepo.save(user);

    return { message: "Password reset successful" };
  }

  async verifyEmail(input: VerifyEmailDTO): Promise<{ message: string }> {
    await validateDTO(input);

    const user = await this.userRepo.findOne({
      where: {
        email: input.email,
        emailVerificationToken: input.token,
      },
    });

    if (!user) {
      throw new AppError("Invalid verification token", 400);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null!;
    await this.userRepo.save(user);

    return { message: "Email verified successfully" };
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.isEmailVerified) {
      throw new AppError("Email already verified", 400);
    }

    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = emailVerificationToken;
    await this.userRepo.save(user);

    await this.emailService.sendEmailVerification(
      user.email,
      emailVerificationToken,
    );

    return { message: "Verification email sent successfully" };
  }
}
