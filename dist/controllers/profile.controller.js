"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfile = exports.updateProfile = exports.getProfile = void 0;
const profile_service_1 = require("../services/profile.service");
const profileService = new profile_service_1.ProfileService();
// ================== GET PROFILE ==================
const getProfile = async (req, res, next) => {
    const profile = await profileService.getProfile(req.user.id);
    res.json(profile);
};
exports.getProfile = getProfile;
// ================== UPDATE PROFILE ==================
const updateProfile = async (req, res, next) => {
    const input = req.body;
    const updatedProfile = await profileService.updateProfile(req.user.id, input);
    res.json(updatedProfile);
};
exports.updateProfile = updateProfile;
// ================== DELETE PROFILE ==================
const deleteProfile = async (req, res, next) => {
    const result = await profileService.deleteProfile(req.user.id);
    res.json(result);
};
exports.deleteProfile = deleteProfile;
//# sourceMappingURL=profile.controller.js.map