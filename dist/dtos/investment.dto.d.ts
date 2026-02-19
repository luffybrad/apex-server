import { InvestmentStatus } from "../models/plan.model";
export declare class CreateInvestmentDTO {
    planId: string;
    amount: number;
}
export declare class InvestmentPlanDTO {
    id: string;
    name: string;
    minAmount: number;
    maxAmount: number;
    returnPercentage: number;
    durationHours: number;
    description: string;
    isActive: boolean;
}
export declare class UserInvestmentDTO {
    id: string;
    planName: string;
    amount: number;
    expectedReturn: number;
    profitEarned: number;
    status: InvestmentStatus;
    startDate: Date;
    endDate: Date;
    completedAt?: Date;
    returnPercentage: number;
}
export declare class InvestmentHistoryDTO {
    totalInvested: number;
    totalReturns: number;
    totalProfit: number;
    activeInvestments: number;
    completedInvestments: number;
    investments: UserInvestmentDTO[];
}
export declare class InvestmentTransactionDTO {
    id: string;
    amount: number;
    type: string;
    description: string;
    balanceBefore: number;
    balanceAfter: number;
    createdAt: Date;
}
//# sourceMappingURL=investment.dto.d.ts.map