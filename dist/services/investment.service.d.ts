import { CreateInvestmentDTO, InvestmentPlanDTO, UserInvestmentDTO, InvestmentHistoryDTO, InvestmentTransactionDTO } from "../dtos/investment.dto";
export declare class InvestmentService {
    private userRepo;
    private planRepo;
    private investmentRepo;
    private transactionRepo;
    constructor();
    initializeDefaultPlans(): Promise<void>;
    getActivePlans(): Promise<InvestmentPlanDTO[]>;
    getPlanById(planId: string): Promise<InvestmentPlanDTO>;
    createInvestment(userId: string, input: CreateInvestmentDTO): Promise<UserInvestmentDTO>;
    processCompletedInvestments(): Promise<void>;
    getUserActiveInvestments(userId: string): Promise<UserInvestmentDTO[]>;
    getUserInvestmentHistory(userId: string): Promise<InvestmentHistoryDTO>;
    getUserTransactions(userId: string, limit?: number): Promise<InvestmentTransactionDTO[]>;
    getInvestmentDetails(investmentId: string, userId: string): Promise<UserInvestmentDTO>;
    calculatePotentialReturns(amount: number, planId: string): Promise<{
        amount: number;
        profit: number;
        totalReturn: number;
        returnPercentage: number;
        durationHours: number;
    }>;
}
//# sourceMappingURL=investment.service.d.ts.map