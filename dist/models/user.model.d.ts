export declare enum UserRole {
    USER = "user",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin"
}
export declare class User {
    id: string;
    phoneNumber: string;
    email: string;
    balance: number;
    password: string;
    role: UserRole;
    isEmailVerified: boolean;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    emailVerificationToken: string;
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): Promise<void>;
}
//# sourceMappingURL=user.model.d.ts.map