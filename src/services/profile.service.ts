// src/services/profile.service.ts
import { Repository } from "typeorm";
import { User } from "../models/user.model";
import { AppDataSource } from "../config/data-source";
import { AppError } from "../utils/app.error";
import { plainToInstance } from "class-transformer";
import { validateDTO } from "../utils/validation";
import { UpdateProfileDTO, ProfileResponseDTO } from "../dtos/profile.dto";

export class ProfileService {
  private userRepo: Repository<User>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
  }

  // View user profile
  async getProfile(userId: string): Promise<ProfileResponseDTO> {
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

    if (!user) throw new AppError("User not found", 404);

    return plainToInstance(ProfileResponseDTO, user);
  }

  // Update profile
  async updateProfile(
    userId: string,
    input: UpdateProfileDTO,
  ): Promise<ProfileResponseDTO> {
    // Validate input DTO first
    await validateDTO(input);

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    if (input.phoneNumber) {
      // Check if phone number is already taken
      const existing = await this.userRepo.findOne({
        where: { phoneNumber: input.phoneNumber },
      });
      if (existing && existing.id !== userId) {
        throw new AppError("Phone number already in use", 400);
      }
      user.phoneNumber = input.phoneNumber;
    }

    if (input.email) {
      // Check if email is already taken
      const existing = await this.userRepo.findOne({
        where: { email: input.email },
      });
      if (existing && existing.id !== userId) {
        throw new AppError("Email already in use", 400);
      }
      user.email = input.email;
      user.isEmailVerified = false; // Reset verification
    }

    if (input.password) user.password = input.password; // Will be hashed in model hook

    // Save updates
    const updatedUser = await this.userRepo.save(user);

    return plainToInstance(ProfileResponseDTO, updatedUser);
  }

  // Delete profile
  async deleteProfile(userId: string): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    await this.userRepo.remove(user);
    return { message: "Profile deleted successfully" };
  }
}
