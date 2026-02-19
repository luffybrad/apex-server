import { AuthResponseDTO, LoginDTO, SignupDTO, ForgotPasswordDTO, ResetPasswordDTO, VerifyEmailDTO } from "../dtos/auth.dto";
export declare class AuthService {
    private userRepo;
    private emailService;
    constructor();
    signup(input: SignupDTO): Promise<AuthResponseDTO>;
    login(input: LoginDTO): Promise<AuthResponseDTO>;
    forgotPassword(input: ForgotPasswordDTO): Promise<{
        message: string;
    }>;
    resetPassword(token: string, input: ResetPasswordDTO): Promise<{
        message: string;
    }>;
    verifyEmail(input: VerifyEmailDTO): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map