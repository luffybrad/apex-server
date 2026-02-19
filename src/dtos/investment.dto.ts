// src/dtos/investment.dto.ts
import {
  IsNumber,
  Min,
  Max,
  IsUUID,
  IsOptional,
  IsEnum,
  MinLength,
} from "class-validator";
import { InvestmentStatus } from "../models/plan.model";

export class CreateInvestmentDTO {
  @IsUUID()
  planId!: string;

  @IsNumber()
  @Min(500)
  @Max(50000)
  amount!: number;
}

export class InvestmentPlanDTO {
  id!: string;
  name!: string;
  minAmount!: number;
  maxAmount!: number;
  returnPercentage!: number;
  durationHours!: number;
  description!: string;
  isActive!: boolean;
}

export class UserInvestmentDTO {
  id!: string;
  planName!: string;
  amount!: number;
  expectedReturn!: number;
  profitEarned!: number;
  status!: InvestmentStatus;
  startDate!: Date;
  endDate!: Date;
  completedAt?: Date;
  returnPercentage!: number;
}

export class InvestmentHistoryDTO {
  totalInvested!: number;
  totalReturns!: number;
  totalProfit!: number;
  activeInvestments!: number;
  completedInvestments!: number;
  investments!: UserInvestmentDTO[];
}

export class InvestmentTransactionDTO {
  id!: string;
  amount!: number;
  type!: string;
  description!: string;
  balanceBefore!: number;
  balanceAfter!: number;
  createdAt!: Date;
}
