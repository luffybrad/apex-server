// src/services/transaction.service.ts
import { Repository } from "typeorm";
import { User } from "../models/user.model";
import { InvestmentTransaction } from "../models/plan.model";
import { AppDataSource } from "../config/data-source";
import { AppError } from "../utils/app.error";
import { validateDTO } from "../utils/validation";
import { DepositDTO, WithdrawalDTO } from "../dtos/transaction.dto";
import { plainToInstance } from "class-transformer";

export class TransactionService {
  private userRepo: Repository<User>;
  private transactionRepo: Repository<InvestmentTransaction>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
    this.transactionRepo = AppDataSource.getRepository(InvestmentTransaction);
  }

  // Process deposit
  async deposit(
    userId: string,
    input: DepositDTO,
  ): Promise<InvestmentTransaction> {
    const dto = plainToInstance(DepositDTO, input);
    await validateDTO(dto);

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Record balance before
      const balanceBefore = Number(user.balance);

      // Update user balance
      user.balance = Number(user.balance) + input.amount;
      await queryRunner.manager.save(user);

      // Create transaction record
      const transaction = this.transactionRepo.create({
        userId: user.id,
        amount: input.amount,
        type: "deposit",
        description: `Deposit of KSh ${input.amount}`,
        balanceBefore,
        balanceAfter: Number(user.balance),
        metadata: {
          paymentMethod: input.paymentMethod,
          transactionReference: input.transactionReference,
          timestamp: new Date(),
        },
      });
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Process withdrawal
  async withdraw(
    userId: string,
    input: WithdrawalDTO,
  ): Promise<InvestmentTransaction> {
    await validateDTO(input);

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    // Check sufficient balance
    if (Number(user.balance) < input.amount) {
      throw new AppError("Insufficient balance", 400);
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Record balance before
      const balanceBefore = Number(user.balance);

      // Update user balance
      user.balance = Number(user.balance) - input.amount;
      await queryRunner.manager.save(user);

      // Create transaction record
      const transaction = this.transactionRepo.create({
        userId: user.id,
        amount: input.amount,
        type: "withdrawal",
        description: `Withdrawal of KSh ${input.amount}`,
        balanceBefore,
        balanceAfter: Number(user.balance),
        metadata: {
          withdrawalMethod: input.withdrawalMethod,
          accountDetails: input.accountDetails,
          timestamp: new Date(),
        },
      });
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Get user's transaction history
  async getUserTransactions(
    userId: string,
    limit: number = 50,
  ): Promise<InvestmentTransaction[]> {
    return await this.transactionRepo.find({
      where: { userId },
      order: { createdAt: "DESC" },
      take: limit,
    });
  }

  // Get user's balance
  async getUserBalance(userId: string): Promise<number> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);
    return Number(user.balance);
  }
}
