"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentService = void 0;
// src/services/investment.service.ts
const typeorm_1 = require("typeorm");
const user_model_1 = require("../models/user.model");
const plan_model_1 = require("../models/plan.model");
const data_source_1 = require("../config/data-source");
const app_error_1 = require("../utils/app.error");
const class_transformer_1 = require("class-transformer");
const validation_1 = require("../utils/validation");
const investment_dto_1 = require("../dtos/investment.dto");
class InvestmentService {
    constructor() {
        this.userRepo = data_source_1.AppDataSource.getRepository(user_model_1.User);
        this.planRepo = data_source_1.AppDataSource.getRepository(plan_model_1.InvestmentPlan);
        this.investmentRepo = data_source_1.AppDataSource.getRepository(plan_model_1.UserInvestment);
        this.transactionRepo = data_source_1.AppDataSource.getRepository(plan_model_1.InvestmentTransaction);
    }
    // Initialize default investment plans
    async initializeDefaultPlans() {
        const count = await this.planRepo.count();
        if (count > 0)
            return;
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
    async getActivePlans() {
        const plans = await this.planRepo.find({
            where: { isActive: true },
            order: { minAmount: "ASC" },
        });
        return (0, class_transformer_1.plainToInstance)(investment_dto_1.InvestmentPlanDTO, plans);
    }
    // Get plan by ID
    async getPlanById(planId) {
        const plan = await this.planRepo.findOne({ where: { id: planId } });
        if (!plan)
            throw new app_error_1.AppError("Investment plan not found", 404);
        return (0, class_transformer_1.plainToInstance)(investment_dto_1.InvestmentPlanDTO, plan);
    }
    // Create new investment
    async createInvestment(userId, input) {
        await (0, validation_1.validateDTO)(input);
        // Get user with balance
        const user = await this.userRepo.findOne({
            where: { id: userId },
            select: ["id", "balance", "phoneNumber"],
        });
        if (!user)
            throw new app_error_1.AppError("User not found", 404);
        // Get plan
        const plan = await this.planRepo.findOne({
            where: { id: input.planId, isActive: true },
        });
        if (!plan)
            throw new app_error_1.AppError("Investment plan not found", 404);
        // Validate amount range
        if (input.amount < plan.minAmount || input.amount > plan.maxAmount) {
            throw new app_error_1.AppError(`Amount must be between KSh ${plan.minAmount} and KSh ${plan.maxAmount}`, 400);
        }
        // Check sufficient balance
        if (user.balance < input.amount) {
            throw new app_error_1.AppError("Insufficient balance", 400);
        }
        // Calculate returns
        const profit = (input.amount * plan.returnPercentage) / 100;
        const expectedReturn = input.amount + profit;
        // Calculate dates
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + plan.durationHours);
        // Start transaction
        const queryRunner = data_source_1.AppDataSource.createQueryRunner();
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
                status: plan_model_1.InvestmentStatus.ACTIVE,
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
            return (0, class_transformer_1.plainToInstance)(investment_dto_1.UserInvestmentDTO, {
                ...investment,
                planName: plan.name,
                returnPercentage: plan.returnPercentage,
            });
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    // Process completed investments and credit returns
    async processCompletedInvestments() {
        const now = new Date();
        const completedInvestments = await this.investmentRepo.find({
            where: {
                status: plan_model_1.InvestmentStatus.ACTIVE,
                endDate: (0, typeorm_1.LessThan)(now),
            },
            relations: ["user", "plan"],
        });
        for (const investment of completedInvestments) {
            const queryRunner = data_source_1.AppDataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                // Update investment status
                investment.status = plan_model_1.InvestmentStatus.COMPLETED;
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
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                console.error(`Failed to process investment ${investment.id}:`, error);
            }
            finally {
                await queryRunner.release();
            }
        }
    }
    // Get user's active investments
    async getUserActiveInvestments(userId) {
        const investments = await this.investmentRepo.find({
            where: {
                userId,
                status: plan_model_1.InvestmentStatus.ACTIVE,
            },
            relations: ["plan"],
            order: { endDate: "ASC" },
        });
        return investments.map((inv) => (0, class_transformer_1.plainToInstance)(investment_dto_1.UserInvestmentDTO, {
            ...inv,
            planName: inv.plan.name,
            returnPercentage: inv.plan.returnPercentage,
        }));
    }
    // Get user's investment history
    async getUserInvestmentHistory(userId) {
        const investments = await this.investmentRepo.find({
            where: { userId },
            relations: ["plan"],
            order: { createdAt: "DESC" },
        });
        const dtos = investments.map((inv) => (0, class_transformer_1.plainToInstance)(investment_dto_1.UserInvestmentDTO, {
            ...inv,
            planName: inv.plan.name,
            returnPercentage: inv.plan.returnPercentage,
        }));
        // Calculate totals
        const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
        const totalReturns = investments
            .filter((inv) => inv.status === plan_model_1.InvestmentStatus.COMPLETED)
            .reduce((sum, inv) => sum + Number(inv.expectedReturn), 0);
        const totalProfit = totalReturns - totalInvested;
        const activeInvestments = investments.filter((inv) => inv.status === plan_model_1.InvestmentStatus.ACTIVE).length;
        const completedInvestments = investments.filter((inv) => inv.status === plan_model_1.InvestmentStatus.COMPLETED).length;
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
    async getUserTransactions(userId, limit = 50) {
        const transactions = await this.transactionRepo.find({
            where: { userId },
            order: { createdAt: "DESC" },
            take: limit,
        });
        return (0, class_transformer_1.plainToInstance)(investment_dto_1.InvestmentTransactionDTO, transactions);
    }
    // Get investment details
    async getInvestmentDetails(investmentId, userId) {
        const investment = await this.investmentRepo.findOne({
            where: { id: investmentId, userId },
            relations: ["plan"],
        });
        if (!investment)
            throw new app_error_1.AppError("Investment not found", 404);
        return (0, class_transformer_1.plainToInstance)(investment_dto_1.UserInvestmentDTO, {
            ...investment,
            planName: investment.plan.name,
            returnPercentage: investment.plan.returnPercentage,
        });
    }
    // Calculate potential returns
    calculatePotentialReturns(amount, planId) {
        return this.getPlanById(planId).then((plan) => {
            if (amount < plan.minAmount || amount > plan.maxAmount) {
                throw new app_error_1.AppError(`Amount must be between KSh ${plan.minAmount} and KSh ${plan.maxAmount}`, 400);
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
exports.InvestmentService = InvestmentService;
//# sourceMappingURL=investment.service.js.map