// src/services/referral.service.ts
import { Repository, IsNull, Not } from "typeorm";
import { User } from "../models/user.model";
import {
  Referral,
  ReferralAward,
  ReferralStatus,
} from "../models/referral.model";
import { UserInvestment, InvestmentStatus } from "../models/plan.model";
import { AppDataSource } from "../config/data-source";
import { AppError } from "../utils/app.error";
import { plainToInstance } from "class-transformer";
import { randomBytes } from "crypto";
import {
  ReferralResponseDTO,
  ReferralStatsDTO,
  ReferralAwardDTO,
} from "../dtos/referral.dto";

export class ReferralService {
  private userRepo: Repository<User>;
  private referralRepo: Repository<Referral>;
  private awardRepo: Repository<ReferralAward>;
  private investmentRepo: Repository<UserInvestment>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
    this.referralRepo = AppDataSource.getRepository(Referral);
    this.awardRepo = AppDataSource.getRepository(ReferralAward);
    this.investmentRepo = AppDataSource.getRepository(UserInvestment);
  }

  // Generate unique referral code
  private generateReferralCode(userId: string, customCode?: string): string {
    if (customCode) {
      return customCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
    }
    // Generate random 8-character code with timestamp to ensure uniqueness
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = randomBytes(2).toString("hex").toUpperCase();
    return `${random}${timestamp.slice(-4)}`;
  }

  // Generate referral link for user
  async generateReferralLink(
    userId: string,
    customCode?: string,
  ): Promise<{ referralCode: string; referralLink: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    // Check if user already has a pending referral code
    const existingReferral = await this.referralRepo.findOne({
      where: {
        referrerId: userId,
        status: ReferralStatus.PENDING,
        referredUserId: IsNull(),
      },
    });

    if (existingReferral) {
      const referralLink = `${process.env.FRONTEND_URL}/signup?ref=${existingReferral.referralCode}`;
      return {
        referralCode: existingReferral.referralCode,
        referralLink,
      };
    }

    let referralCode = this.generateReferralCode(userId, customCode);

    // Check if code already exists
    const existing = await this.referralRepo.findOne({
      where: { referralCode },
    });

    if (existing) {
      // Append random suffix if code exists
      referralCode = `${referralCode}-${randomBytes(1).toString("hex").toUpperCase()}`;
    }

    // Create referral record for tracking
    const referral = this.referralRepo.create({
      referrerId: userId,
      referralCode,
      status: ReferralStatus.PENDING,
    });

    await this.referralRepo.save(referral);

    const referralLink = `${process.env.FRONTEND_URL}/signup?ref=${referralCode}`;

    return { referralCode, referralLink };
  }

  // Get referrer by referral code
  async getReferrerByCode(referralCode: string): Promise<User | null> {
    const referral = await this.referralRepo.findOne({
      where: { referralCode, status: ReferralStatus.PENDING },
      relations: ["referrer"],
    });

    return referral?.referrer || null;
  }

  // Register new user with referral code
  async registerReferredUser(
    newUserId: string,
    referralCode: string,
  ): Promise<void> {
    const referral = await this.referralRepo.findOne({
      where: { referralCode, status: ReferralStatus.PENDING },
    });

    if (!referral) return; // Invalid referral code, ignore

    // Check if referred user already exists
    const existingReferred = await this.referralRepo.findOne({
      where: { referredUserId: newUserId },
    });

    if (existingReferred) return; // Already referred

    // Check if trying to refer yourself
    if (referral.referrerId === newUserId) return;

    // Update referral with referred user
    referral.referredUserId = newUserId;
    referral.status = ReferralStatus.ACTIVE;
    await this.referralRepo.save(referral);
  }

  // Process referral award on first investment
  async processReferralAward(
    userId: string,
    investmentId: string,
  ): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find if user was referred
      const referral = await this.referralRepo.findOne({
        where: {
          referredUserId: userId,
          status: ReferralStatus.ACTIVE,
        },
        relations: ["referrer"],
      });

      if (!referral) {
        await queryRunner.rollbackTransaction();
        return;
      }

      // Get the investment
      const investment = await this.investmentRepo.findOne({
        where: { id: investmentId, userId },
      });

      if (!investment) {
        await queryRunner.rollbackTransaction();
        return;
      }

      // Check if this is first investment
      const previousInvestments = await this.investmentRepo.count({
        where: { userId },
      });

      if (previousInvestments > 1) {
        await queryRunner.rollbackTransaction();
        return;
      }

      // Calculate award (50% of investment amount)
      const awardAmount = Number(investment.amount) * 0.5; // 50%

      // Update referral
      referral.status = ReferralStatus.AWARDED;
      referral.totalTradedAmount = Number(investment.amount);
      referral.awardEarned = awardAmount;
      referral.firstTradeDate = new Date();
      referral.awardedAt = new Date();
      await queryRunner.manager.save(referral);

      // Create award record
      const award = this.awardRepo.create({
        userId: referral.referrerId,
        referralId: referral.id,
        amount: awardAmount,
        awardPercentage: 50,
        description: `Referral award from user for first investment of ${investment.amount}`,
        metadata: {
          investmentId: investment.id,
          investmentAmount: investment.amount,
          referredUserId: userId,
        },
      });
      await queryRunner.manager.save(award);

      // Add award to referrer's balance
      const referrer = await this.userRepo.findOne({
        where: { id: referral.referrerId },
      });
      if (referrer) {
        referrer.balance = Number(referrer.balance) + awardAmount;
        await queryRunner.manager.save(referrer);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Error processing referral award:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Get user's referral statistics
  async getReferralStats(userId: string): Promise<ReferralStatsDTO> {
    const referrals = await this.referralRepo.find({
      where: { referrerId: userId },
      relations: ["referredUser"],
    });

    const awards = await this.awardRepo.find({
      where: { userId },
    });

    const totalAwardsEarned = awards.reduce(
      (sum, a) => sum + Number(a.amount),
      0,
    );

    // Calculate pending awards (active referrals * potential 50% of their first trade)
    const pendingAwards = referrals
      .filter((r) => r.status === ReferralStatus.ACTIVE)
      .reduce((sum, r) => sum + Number(r.totalTradedAmount) * 0.5, 0);

    const stats: ReferralStatsDTO = {
      totalReferrals: referrals.length,
      pendingReferrals: referrals.filter(
        (r) => r.status === ReferralStatus.PENDING,
      ).length,
      activeReferrals: referrals.filter(
        (r) => r.status === ReferralStatus.ACTIVE,
      ).length,
      awardedReferrals: referrals.filter(
        (r) => r.status === ReferralStatus.AWARDED,
      ).length,
      totalAwardsEarned,
      pendingAwards,
      referralCode:
        referrals.find((r) => r.status === ReferralStatus.PENDING)
          ?.referralCode || "",
      referralLink: "",
    };

    // Generate referral link if there's a pending code
    if (stats.referralCode) {
      stats.referralLink = `${process.env.FRONTEND_URL}/signup?ref=${stats.referralCode}`;
    }

    return stats;
  }

  // Get user's referrals list
  async getUserReferrals(userId: string): Promise<ReferralResponseDTO[]> {
    const referrals = await this.referralRepo.find({
      where: { referrerId: userId },
      relations: ["referredUser"],
      order: { createdAt: "DESC" },
    });

    return referrals.map((ref) => ({
      id: ref.id,
      referrerId: ref.referrerId,
      referrerPhone: ref.referrer?.phoneNumber || "",
      referredUserId: ref.referredUserId || undefined,
      referredPhone: ref.referredUser?.phoneNumber,
      referralCode: ref.referralCode,
      status: ref.status,
      totalTradedAmount: Number(ref.totalTradedAmount),
      awardEarned: Number(ref.awardEarned),
      firstTradeDate: ref.firstTradeDate || undefined,
      awardedAt: ref.awardedAt || undefined,
      createdAt: ref.createdAt,
    }));
  }

  // Get referral awards history
  async getReferralAwards(userId: string): Promise<ReferralAwardDTO[]> {
    const awards = await this.awardRepo.find({
      where: { userId },
      relations: ["referral", "referral.referredUser"],
      order: { createdAt: "DESC" },
    });

    return awards.map((award) => ({
      id: award.id,
      amount: Number(award.amount),
      awardPercentage: award.awardPercentage,
      description: award.description,
      createdAt: award.createdAt,
      referralCode: award.referral.referralCode,
      referredPhone: award.referral.referredUser?.phoneNumber || "Unknown",
    }));
  }

  // Get referral by code (public)
  async getReferralByCode(
    referralCode: string,
  ): Promise<{ valid: boolean; referrer?: string }> {
    const referral = await this.referralRepo.findOne({
      where: { referralCode, status: ReferralStatus.PENDING },
      relations: ["referrer"],
    });

    if (!referral) {
      return { valid: false };
    }

    return {
      valid: true,
      referrer: referral.referrer.phoneNumber,
    };
  }
}
