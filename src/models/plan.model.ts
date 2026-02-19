//src/models/plan.model.ts
// src/models/plan.model.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.model";

export enum InvestmentStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Entity("investment_plans")
export class InvestmentPlan {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "decimal", precision: 14, scale: 2 })
  minAmount!: number;

  @Column({ type: "decimal", precision: 14, scale: 2 })
  maxAmount!: number;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  returnPercentage!: number; // e.g., 10% = 10.00

  @Column({ type: "int" })
  durationHours!: number; // Duration in hours

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity("user_investments")
export class UserInvestment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(() => InvestmentPlan)
  @JoinColumn({ name: "planId" })
  plan!: InvestmentPlan;

  @Column()
  planId!: string;

  @Column({ type: "decimal", precision: 14, scale: 2 })
  amount!: number;

  @Column({ type: "decimal", precision: 14, scale: 2 })
  expectedReturn!: number; // Calculated amount + profit

  @Column({ type: "decimal", precision: 14, scale: 2, default: 0 })
  profitEarned!: number;

  @Column({
    type: "enum",
    enum: InvestmentStatus,
    default: InvestmentStatus.ACTIVE,
  })
  status!: InvestmentStatus;

  @Column({ type: "timestamp" })
  startDate!: Date;

  @Column({ type: "timestamp" })
  endDate!: Date; // startDate + durationHours

  @Column({ type: "timestamp", nullable: true })
  completedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity("investment_transactions")
export class InvestmentTransaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(() => UserInvestment)
  @JoinColumn({ name: "investmentId" })
  investment!: UserInvestment;

  @Column({ nullable: true })
  investmentId!: string;

  @Column({ type: "decimal", precision: 14, scale: 2 })
  amount!: number;

  @Column({ type: "varchar", length: 50 })
  type!: "deposit" | "withdrawal" | "investment" | "return";

  @Column({ type: "varchar", length: 255, nullable: true })
  description!: string;

  @Column({ type: "decimal", precision: 14, scale: 2, default: 0 })
  balanceBefore!: number;

  @Column({ type: "decimal", precision: 14, scale: 2, default: 0 })
  balanceAfter!: number;

  @Column({ type: "json", nullable: true })
  metadata!: any; // For storing M-PESA transaction details

  @CreateDateColumn()
  createdAt!: Date;
}
