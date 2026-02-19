"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const user_model_1 = require("../models/user.model");
const data_source_1 = require("../config/data-source");
const app_error_1 = require("../utils/app.error");
const class_transformer_1 = require("class-transformer");
const validation_1 = require("../utils/validation");
const profile_dto_1 = require("../dtos/profile.dto");
class ProfileService {
    constructor() {
        this.userRepo = data_source_1.AppDataSource.getRepository(user_model_1.User);
    }
    // View user profile
    async getProfile(userId) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            select: [
                "id",
                "phoneNumber",
                "email",
                "role",
                "isEmailVerified",
                "balance",
                "createdAt",
                "updatedAt",
            ],
        });
        if (!user)
            throw new app_error_1.AppError("User not found", 404);
        return (0, class_transformer_1.plainToInstance)(profile_dto_1.ProfileResponseDTO, user);
    }
    // Update profile
    async updateProfile(userId, input) {
        // Validate input DTO first
        await (0, validation_1.validateDTO)(input);
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new app_error_1.AppError("User not found", 404);
        if (input.phoneNumber) {
            // Check if phone number is already taken
            const existing = await this.userRepo.findOne({
                where: { phoneNumber: input.phoneNumber },
            });
            if (existing && existing.id !== userId) {
                throw new app_error_1.AppError("Phone number already in use", 400);
            }
            user.phoneNumber = input.phoneNumber;
        }
        if (input.email) {
            // Check if email is already taken
            const existing = await this.userRepo.findOne({
                where: { email: input.email },
            });
            if (existing && existing.id !== userId) {
                throw new app_error_1.AppError("Email already in use", 400);
            }
            user.email = input.email;
            user.isEmailVerified = false; // Reset verification
        }
        if (input.password)
            user.password = input.password; // Will be hashed in model hook
        // Save updates
        const updatedUser = await this.userRepo.save(user);
        return (0, class_transformer_1.plainToInstance)(profile_dto_1.ProfileResponseDTO, updatedUser);
    }
    // Delete profile
    async deleteProfile(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new app_error_1.AppError("User not found", 404);
        await this.userRepo.remove(user);
        return { message: "Profile deleted successfully" };
    }
}
exports.ProfileService = ProfileService;
//# sourceMappingURL=profile.service.js.map