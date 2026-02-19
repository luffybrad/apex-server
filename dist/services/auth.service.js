"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = require("../models/user.model");
const app_error_1 = require("../utils/app.error");
const auth_dto_1 = require("../dtos/auth.dto");
const data_source_1 = require("../config/data-source");
const class_transformer_1 = require("class-transformer");
const validation_1 = require("../utils/validation");
const jwt_1 = require("../utils/jwt");
const email_service_1 = require("../utils/email.service");
class AuthService {
    constructor() {
        this.userRepo = data_source_1.AppDataSource.getRepository(user_model_1.User);
        this.emailService = new email_service_1.EmailService();
    }
    async signup(input) {
        const dto = (0, class_transformer_1.plainToInstance)(auth_dto_1.SignupDTO, input);
        await (0, validation_1.validateDTO)(dto);
        // Check if user already exists by phone or email
        const existingUser = await this.userRepo.findOne({
            where: [{ phoneNumber: input.phoneNumber }, { email: input.email }],
        });
        if (existingUser) {
            if (existingUser.phoneNumber === input.phoneNumber) {
                throw new app_error_1.AppError("Phone number already registered", 400);
            }
            if (existingUser.email === input.email) {
                throw new app_error_1.AppError("Email already registered", 400);
            }
        }
        // Generate email verification token
        const emailVerificationToken = crypto_1.default.randomBytes(32).toString("hex");
        // Save user
        const user = this.userRepo.create({
            phoneNumber: input.phoneNumber,
            email: input.email,
            password: input.password,
            role: user_model_1.UserRole.USER,
            emailVerificationToken,
        });
        const savedUser = await this.userRepo.save(user);
        // Send verification email
        await this.emailService.sendEmailVerification(savedUser.email, emailVerificationToken);
        // Generate JWT
        const token = (0, jwt_1.generateToken)({
            id: savedUser.id,
            phoneNumber: savedUser.phoneNumber,
            email: savedUser.email,
            role: savedUser.role,
        });
        // Send welcome email
        await this.emailService.sendWelcomeEmail(savedUser.email, savedUser.phoneNumber);
        return new auth_dto_1.AuthResponseDTO({
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
    async login(input) {
        const dto = (0, class_transformer_1.plainToInstance)(auth_dto_1.LoginDTO, input);
        await (0, validation_1.validateDTO)(dto);
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
            throw new app_error_1.AppError("Invalid credentials", 401);
        }
        // Compare passwords
        const isPasswordValid = await bcryptjs_1.default.compare(input.password, user.password);
        if (!isPasswordValid) {
            throw new app_error_1.AppError("Invalid credentials", 401);
        }
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            phoneNumber: user.phoneNumber,
            email: user.email,
            role: user.role,
        });
        return new auth_dto_1.AuthResponseDTO({
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
    async forgotPassword(input) {
        await (0, validation_1.validateDTO)(input);
        const user = await this.userRepo.findOne({ where: { email: input.email } });
        if (!user) {
            // Don't reveal if user exists
            return {
                message: "If your email is registered, you will receive a password reset link",
            };
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await this.userRepo.save(user);
        // Send reset email
        await this.emailService.sendPasswordResetEmail(user.email, resetToken);
        return { message: "Password reset email sent successfully" };
    }
    async resetPassword(token, input) {
        await (0, validation_1.validateDTO)(input);
        if (input.newPassword !== input.confirmPassword) {
            throw new app_error_1.AppError("Passwords do not match", 400);
        }
        const user = await this.userRepo.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: new Date() },
            },
        });
        if (!user) {
            throw new app_error_1.AppError("Invalid or expired reset token", 400);
        }
        user.password = input.newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await this.userRepo.save(user);
        return { message: "Password reset successful" };
    }
    async verifyEmail(input) {
        await (0, validation_1.validateDTO)(input);
        const user = await this.userRepo.findOne({
            where: {
                email: input.email,
                emailVerificationToken: input.token,
            },
        });
        if (!user) {
            throw new app_error_1.AppError("Invalid verification token", 400);
        }
        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        await this.userRepo.save(user);
        return { message: "Email verified successfully" };
    }
    async resendVerificationEmail(email) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new app_error_1.AppError("User not found", 404);
        }
        if (user.isEmailVerified) {
            throw new app_error_1.AppError("Email already verified", 400);
        }
        const emailVerificationToken = crypto_1.default.randomBytes(32).toString("hex");
        user.emailVerificationToken = emailVerificationToken;
        await this.userRepo.save(user);
        await this.emailService.sendEmailVerification(user.email, emailVerificationToken);
        return { message: "Verification email sent successfully" };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map