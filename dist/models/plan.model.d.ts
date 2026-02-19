import { User } from "./user.model";
export declare enum InvestmentStatus {
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class InvestmentPlan {
    id: string;
    minAmount: number;
    maxAmount: number;
    returnPercentage: number;
    durationHours: number;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class UserInvestment {
    id: string;
    user: User;
    userId: string;
    plan: InvestmentPlan;
    planId: string;
    amount: number;
    expectedReturn: number;
    profitEarned: number;
    status: InvestmentStatus;
    startDate: Date;
    endDate: Date;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class InvestmentTransaction {
    id: string;
    user: User;
    userId: string;
    investment: UserInvestment;
    investmentId: string;
    amount: number;
    type: "deposit" | "withdrawal" | "investment" | "return";
    description: string;
    balanceBefore: number;
    balanceAfter: number;
    metadata: any;
    createdAt: Date;
}
//# sourceMappingURL=plan.model.d.ts.map