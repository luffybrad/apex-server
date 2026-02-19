import { UpdateProfileDTO, ProfileResponseDTO } from "../dtos/profile.dto";
export declare class ProfileService {
    private userRepo;
    constructor();
    getProfile(userId: string): Promise<ProfileResponseDTO>;
    updateProfile(userId: string, input: UpdateProfileDTO): Promise<ProfileResponseDTO>;
    deleteProfile(userId: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=profile.service.d.ts.map