export declare class EmailService {
    private transporter;
    constructor();
    sendPasswordResetEmail(to: string, resetToken: string): Promise<void>;
    sendEmailVerification(to: string, verificationToken: string): Promise<void>;
    sendWelcomeEmail(to: string, name: string): Promise<void>;
}
//# sourceMappingURL=email.service.d.ts.map