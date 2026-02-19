import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/user.model";
export interface AuthRequest extends Request {
    user?: {
        id: string;
        phoneNumber: string;
        email: string;
        role: UserRole;
    };
}
export declare const authenticateJWT: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const authorize: (...roles: UserRole[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const isAdmin: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const isSuperAdmin: (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map