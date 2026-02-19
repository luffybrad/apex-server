import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
export declare const initializePlans: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getActivePlans: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getPlanById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createInvestment: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getActiveInvestments: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getInvestmentHistory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getInvestmentDetails: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getTransactionHistory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const calculateReturns: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const processCompletedInvestments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllInvestments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getInvestmentStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=investment.controller.d.ts.map