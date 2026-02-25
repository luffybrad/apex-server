// src/dtos/referral.dto.ts
import { IsOptional, IsString, IsUUID } from "class-validator";
import { ReferralStatus } from "../models/referral.model";

export class GenerateReferralLinkDTO {
  @IsString()
  @IsOptional()
  customCode?: string;
}

export class ReferralResponseDTO {
  id!: string;
  referrerId!: string;
  referrerPhone!: string;
  referredUserId?: string;
  referredPhone?: string;
  referralCode!: string;
  status!: ReferralStatus;
  totalTradedAmount!: number;
  awardEarned!: number;
  firstTradeDate?: Date;
  awardedAt?: Date;
  createdAt!: Date;
}

export class ReferralStatsDTO {
  totalReferrals!: number;
  pendingReferrals!: number;
  activeReferrals!: number;
  awardedReferrals!: number;
  totalAwardsEarned!: number;
  pendingAwards!: number;
  referralCode!: string;
  referralLink!: string;
}

export class AwardReferralDTO {
  @IsUUID()
  referralId!: string;

  @IsUUID()
  investmentId!: string;
}

export class ReferralAwardDTO {
  id!: string;
  amount!: number;
  awardPercentage!: number;
  description!: string;
  createdAt!: Date;
  referralCode!: string;
  referredPhone!: string;
}
