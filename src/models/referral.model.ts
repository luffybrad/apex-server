// src/models/referral.model.ts
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

export enum ReferralStatus {
  PENDING = "pending",
  ACTIVE = "active",
  AWARDED = "awarded",
  EXPIRED = "expired",
}

@Entity("referrals")
export class Referral {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "referrerId" })
  referrer!: User;

  @Column()
  referrerId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "referredUserId" }) // Add this missing JoinColumn
  referredUser!: User;

  @Column({ nullable: true }) // Make nullable since it starts as null
  referredUserId!: string;

  @Column({ unique: true })
  referralCode!: string;

  @Column({
    type: "enum",
    enum: ReferralStatus,
    default: ReferralStatus.PENDING,
  })
  status!: ReferralStatus;

  @Column({ type: "decimal", precision: 14, scale: 2, default: 0 })
  totalTradedAmount!: number;

  @Column({ type: "decimal", precision: 14, scale: 2, default: 0 })
  awardEarned!: number;

  @Column({ type: "timestamp", nullable: true })
  firstTradeDate!: Date;

  @Column({ type: "timestamp", nullable: true })
  awardedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity("referral_awards")
export class ReferralAward {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(() => Referral)
  @JoinColumn({ name: "referralId" })
  referral!: Referral;

  @Column()
  referralId!: string;

  @Column({ type: "decimal", precision: 14, scale: 2 })
  amount!: number;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 50 })
  awardPercentage!: number;

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @Column({ type: "json", nullable: true })
  metadata!: any;

  @CreateDateColumn()
  createdAt!: Date;
}
