// src/services/investment.service.ts
import { Repository, Between, LessThan } from "typeorm";
import { User } from "../models/user.model";
import {
  InvestmentPlan,
  UserInvestment,
  InvestmentTransaction,
  InvestmentStatus,
} from "../models/plan.model";
import { AppDataSource } from "../config/data-source";
import { AppError } from "../utils/app.error";
import { plainToInstance } from "class-transformer";
import { validateDTO } from "../utils/validation";
import {
  CreateInvestmentDTO,
  InvestmentPlanDTO,
  UserInvestmentDTO,
  InvestmentHistoryDTO,
  InvestmentTransactionDTO,
} from "../dtos/investment.dto";
import { MoreThan } from "typeorm";

export class InvestmentService {
  private userRepo: Repository<User>;
  private planRepo: Repository<InvestmentPlan>;
  private investmentRepo: Repository<UserInvestment>;
  private transactionRepo: Repository<InvestmentTransaction>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
    this.planRepo = AppDataSource.getRepository(InvestmentPlan);
    this.investmentRepo = AppDataSource.getRepository(UserInvestment);
    this.transactionRepo = AppDataSource.getRepository(InvestmentTransaction);
  }

  // Initialize default investment plans
  async initializeDefaultPlans(): Promise<void> {
    const count = await this.planRepo.count();
    if (count > 0) return;

    const plans = [
      {
        name: "Starter",
        minAmount: 500,
        maxAmount: 1000,
        returnPercentage: 10,
        durationHours: 24,
        description: "Start small, earn 10% returns in 24 hours",
      },
      {
        name: "Bronze",
        minAmount: 1100,
        maxAmount: 5000,
        returnPercentage: 15,
        durationHours: 48,
        description: "15% returns in 48 hours",
      },
      {
        name: "Silver",
        minAmount: 5100,
        maxAmount: 10000,
        returnPercentage: 20,
        durationHours: 72,
        description: "20% returns in 72 hours",
      },
      {
        name: "Gold",
        minAmount: 10100,
        maxAmount: 25000,
        returnPercentage: 25,
        durationHours: 96,
        description: "25% returns in 96 hours",
      },
      {
        name: "Platinum",
        minAmount: 25100,
        maxAmount: 50000,
        returnPercentage: 30,
        durationHours: 120,
        description: "30% returns in 120 hours (5 days)",
      },
    ];

    await this.planRepo.save(plans);
  }

  // Get all active investment plans
  async getActivePlans(): Promise<InvestmentPlanDTO[]> {
    const plans = await this.planRepo.find({
      where: { isActive: true },
      order: { minAmount: "ASC" },
    });
    return plainToInstance(InvestmentPlanDTO, plans);
  }

  // Get plan by ID
  async getPlanById(planId: string): Promise<InvestmentPlanDTO> {
    const plan = await this.planRepo.findOne({ where: { id: planId } });
    if (!plan) throw new AppError("Investment plan not found", 404);
    return plainToInstance(InvestmentPlanDTO, plan);
  }

  // Create new investment
  async createInvestment(
    userId: string,
    input: CreateInvestmentDTO,
  ): Promise<UserInvestmentDTO> {
    await validateDTO(input);

    // Get user with balance
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ["id", "balance", "phoneNumber"],
    });
    if (!user) throw new AppError("User not found", 404);

    // Get plan
    const plan = await this.planRepo.findOne({
      where: { id: input.planId, isActive: true },
    });
    if (!plan) throw new AppError("Investment plan not found", 404);

    // Validate amount range
    if (input.amount < plan.minAmount || input.amount > plan.maxAmount) {
      throw new AppError(
        `Amount must be between KSh ${plan.minAmount} and KSh ${plan.maxAmount}`,
        400,
      );
    }

    // Check sufficient balance
    if (user.balance < input.amount) {
      throw new AppError("Insufficient balance", 400);
    }

    // Calculate returns
    const profit = (input.amount * plan.returnPercentage) / 100;
    const expectedReturn = input.amount + profit;

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + plan.durationHours);

    // Start transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Deduct from user balance
      user.balance -= input.amount;
      await queryRunner.manager.save(user);

      // Create investment record
      const investment = this.investmentRepo.create({
        userId: user.id,
        planId: plan.id,
        amount: input.amount,
        expectedReturn,
        profitEarned: 0,
        startDate,
        endDate,
        status: InvestmentStatus.ACTIVE,
      });
      await queryRunner.manager.save(investment);

      // Create transaction record
      const transaction = this.transactionRepo.create({
        userId: user.id,
        investmentId: investment.id,
        amount: input.amount,
        type: "investment",
        description: `Invested in ${plan.name} plan`,
        balanceBefore: user.balance + input.amount,
        balanceAfter: user.balance,
      });
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();

      return plainToInstance(UserInvestmentDTO, {
        ...investment,
        planName: plan.name,
        returnPercentage: plan.returnPercentage,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Process completed investments and credit returns
  async processCompletedInvestments(): Promise<void> {
    const now = new Date();

    const completedInvestments = await this.investmentRepo.find({
      where: {
        status: InvestmentStatus.ACTIVE,
        endDate: LessThan(now),
      },
      relations: ["user", "plan"],
    });

    for (const investment of completedInvestments) {
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Update investment status
        investment.status = InvestmentStatus.COMPLETED;
        investment.completedAt = now;
        investment.profitEarned = investment.expectedReturn - investment.amount;
        await queryRunner.manager.save(investment);

        // Credit user with returns
        const user = investment.user;
        const balanceBefore = user.balance;
        user.balance += investment.expectedReturn;
        await queryRunner.manager.save(user);

        // Create return transaction
        const transaction = this.transactionRepo.create({
          userId: user.id,
          investmentId: investment.id,
          amount: investment.expectedReturn,
          type: "return",
          description: `Returns from ${investment.plan.name} plan`,
          balanceBefore,
          balanceAfter: user.balance,
        });
        await queryRunner.manager.save(transaction);

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error(`Failed to process investment ${investment.id}:`, error);
      } finally {
        await queryRunner.release();
      }
    }
  }

  // Get user's active investments
  async getUserActiveInvestments(userId: string): Promise<UserInvestmentDTO[]> {
    const investments = await this.investmentRepo.find({
      where: {
        userId,
        status: InvestmentStatus.ACTIVE,
      },
      relations: ["plan"],
      order: { endDate: "ASC" },
    });

    return investments.map((inv) =>
      plainToInstance(UserInvestmentDTO, {
        ...inv,
        planName: inv.plan.name,
        returnPercentage: inv.plan.returnPercentage,
      }),
    );
  }

  // Get user's investment history
  async getUserInvestmentHistory(
    userId: string,
  ): Promise<InvestmentHistoryDTO> {
    const investments = await this.investmentRepo.find({
      where: { userId },
      relations: ["plan"],
      order: { createdAt: "DESC" },
    });

    const dtos = investments.map((inv) =>
      plainToInstance(UserInvestmentDTO, {
        ...inv,
        planName: inv.plan.name,
        returnPercentage: inv.plan.returnPercentage,
      }),
    );

    // Calculate totals
    const totalInvested = investments.reduce(
      (sum, inv) => sum + Number(inv.amount),
      0,
    );
    const totalReturns = investments
      .filter((inv) => inv.status === InvestmentStatus.COMPLETED)
      .reduce((sum, inv) => sum + Number(inv.expectedReturn), 0);
    const totalProfit = totalReturns - totalInvested;
    const activeInvestments = investments.filter(
      (inv) => inv.status === InvestmentStatus.ACTIVE,
    ).length;
    const completedInvestments = investments.filter(
      (inv) => inv.status === InvestmentStatus.COMPLETED,
    ).length;

    return {
      totalInvested,
      totalReturns,
      totalProfit,
      activeInvestments,
      completedInvestments,
      investments: dtos,
    };
  }

  // Get user's transaction history
  async getUserTransactions(
    userId: string,
    limit: number = 50,
  ): Promise<InvestmentTransactionDTO[]> {
    const transactions = await this.transactionRepo.find({
      where: { userId },
      order: { createdAt: "DESC" },
      take: limit,
    });

    return plainToInstance(InvestmentTransactionDTO, transactions);
  }

  // Get investment details
  async getInvestmentDetails(
    investmentId: string,
    userId: string,
  ): Promise<UserInvestmentDTO> {
    const investment = await this.investmentRepo.findOne({
      where: { id: investmentId, userId },
      relations: ["plan"],
    });

    if (!investment) throw new AppError("Investment not found", 404);

    return plainToInstance(UserInvestmentDTO, {
      ...investment,
      planName: investment.plan.name,
      returnPercentage: investment.plan.returnPercentage,
    });
  }

  // Calculate potential returns
  calculatePotentialReturns(
    amount: number,
    planId: string,
  ): Promise<{
    amount: number;
    profit: number;
    totalReturn: number;
    returnPercentage: number;
    durationHours: number;
  }> {
    return this.getPlanById(planId).then((plan) => {
      if (amount < plan.minAmount || amount > plan.maxAmount) {
        throw new AppError(
          `Amount must be between KSh ${plan.minAmount} and KSh ${plan.maxAmount}`,
          400,
        );
      }

      const profit = (amount * plan.returnPercentage) / 100;
      const totalReturn = amount + profit;

      return {
        amount,
        profit,
        totalReturn,
        returnPercentage: plan.returnPercentage,
        durationHours: plan.durationHours,
      };
    });
  }
}
