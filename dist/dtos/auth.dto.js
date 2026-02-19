"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCreateUserDTO = exports.AuthResponseDTO = exports.VerifyEmailDTO = exports.ResetPasswordDTO = exports.ForgotPasswordDTO = exports.LoginDTO = exports.SignupDTO = void 0;
// src/dtos/auth.dto.ts
const class_validator_1 = require("class-validator");
class SignupDTO {
}
exports.SignupDTO = SignupDTO;
__decorate([
    (0, class_validator_1.IsPhoneNumber)("KE", { message: "Phone number must be in Kenyan format" }),
    __metadata("design:type", String)
], SignupDTO.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Please provide a valid email address" }),
    __metadata("design:type", String)
], SignupDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.MinLength)(8, { message: "Password must be at least 8 characters" }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
    __metadata("design:type", String)
], SignupDTO.prototype, "password", void 0);
class LoginDTO {
}
exports.LoginDTO = LoginDTO;
__decorate([
    (0, class_validator_1.IsPhoneNumber)("KE", { message: "Phone number must be in Kenyan format" }),
    __metadata("design:type", String)
], LoginDTO.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.MinLength)(8, { message: "Password must be at least 8 characters" }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
    __metadata("design:type", String)
], LoginDTO.prototype, "password", void 0);
class ForgotPasswordDTO {
}
exports.ForgotPasswordDTO = ForgotPasswordDTO;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Please provide a valid email address" }),
    __metadata("design:type", String)
], ForgotPasswordDTO.prototype, "email", void 0);
class ResetPasswordDTO {
}
exports.ResetPasswordDTO = ResetPasswordDTO;
__decorate([
    (0, class_validator_1.MinLength)(8, { message: "Password must be at least 8 characters" }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
    __metadata("design:type", String)
], ResetPasswordDTO.prototype, "newPassword", void 0);
__decorate([
    (0, class_validator_1.MinLength)(8, { message: "Password must be at least 8 characters" }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
    __metadata("design:type", String)
], ResetPasswordDTO.prototype, "confirmPassword", void 0);
class VerifyEmailDTO {
}
exports.VerifyEmailDTO = VerifyEmailDTO;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Please provide a valid email address" }),
    __metadata("design:type", String)
], VerifyEmailDTO.prototype, "email", void 0);
class AuthResponseDTO {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.AuthResponseDTO = AuthResponseDTO;
class AdminCreateUserDTO {
}
exports.AdminCreateUserDTO = AdminCreateUserDTO;
__decorate([
    (0, class_validator_1.IsPhoneNumber)("KE", { message: "Phone number must be in Kenyan format" }),
    __metadata("design:type", String)
], AdminCreateUserDTO.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Please provide a valid email address" }),
    __metadata("design:type", String)
], AdminCreateUserDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.MinLength)(8, { message: "Password must be at least 8 characters" }),
    __metadata("design:type", String)
], AdminCreateUserDTO.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdminCreateUserDTO.prototype, "role", void 0);
//# sourceMappingURL=auth.dto.js.map