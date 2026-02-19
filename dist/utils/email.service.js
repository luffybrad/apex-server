"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
// src/utils/email.service.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async sendPasswordResetEmail(to, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: `"Apex Investments" <${process.env.SMTP_FROM}>`,
            to,
            subject: "Password Reset Request",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #764ba2;">Password Reset Request</h2>
          <p>You requested a password reset for your Apex Investments account.</p>
          <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">© 2024 Apex Investments. All rights reserved.</p>
        </div>
      `,
        };
        await this.transporter.sendMail(mailOptions);
    }
    async sendEmailVerification(to, verificationToken) {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const mailOptions = {
            from: `"Apex Investments" <${process.env.SMTP_FROM}>`,
            to,
            subject: "Verify Your Email Address",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #764ba2;">Welcome to Apex Investments!</h2>
          <p>Please verify your email address to get started.</p>
          <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
          <p>If you didn't create an account, please ignore this email.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">© 2024 Apex Investments. All rights reserved.</p>
        </div>
      `,
        };
        await this.transporter.sendMail(mailOptions);
    }
    async sendWelcomeEmail(to, name) {
        const mailOptions = {
            from: `"Apex Investments" <${process.env.SMTP_FROM}>`,
            to,
            subject: "Welcome to Apex Investments!",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #764ba2;">Welcome, ${name}!</h2>
          <p>Thank you for joining Apex Investments. We're excited to have you on board.</p>
          <p>Start exploring our investment plans and grow your wealth with us.</p>
          <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Go to Dashboard</a>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">© 2024 Apex Investments. All rights reserved.</p>
        </div>
      `,
        };
        await this.transporter.sendMail(mailOptions);
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map