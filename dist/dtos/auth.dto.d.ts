import { UserRole } from "../models/user.model";
export declare class SignupDTO {
    phoneNumber: string;
    email: string;
    password: string;
}
export declare class LoginDTO {
    phoneNumber: string;
    password: string;
}
export declare class ForgotPasswordDTO {
    email: string;
}
export declare class ResetPasswordDTO {
    newPassword: string;
    confirmPassword: string;
}
export declare class VerifyEmailDTO {
    email: string;
    token: string;
}
export declare class AuthResponseDTO {
    id: string;
    phoneNumber: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    balance: number;
    updatedAt: Date;
    token?: string;
    constructor(partial: Partial<AuthResponseDTO>);
}
export declare class AdminCreateUserDTO {
    phoneNumber: string;
    email: string;
    password: string;
    role?: UserRole;
}
//# sourceMappingURL=auth.dto.d.ts.map