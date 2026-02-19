import { UserRole } from "../models/user.model";
export declare class UpdateProfileDTO {
    phoneNumber?: string;
    email?: string;
    password?: string;
}
export declare class ProfileResponseDTO {
    id: string;
    phoneNumber: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<ProfileResponseDTO>);
}
//# sourceMappingURL=profile.dto.d.ts.map