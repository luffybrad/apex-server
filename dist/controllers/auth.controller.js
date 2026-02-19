"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerification = exports.verifyEmail = exports.resetPassword = exports.forgotPassword = exports.login = exports.signup = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
const signup = async (req, res, next) => {
    try {
        const input = req.body;
        const user = await authService.signup(input);
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.signup = signup;
const login = async (req, res, next) => {
    try {
        const input = req.body;
        const user = await authService.login(input);
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const forgotPassword = async (req, res, next) => {
    try {
        const input = req.body;
        const result = await authService.forgotPassword(input);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const input = req.body;
        const result = await authService.resetPassword(token, input);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
const verifyEmail = async (req, res, next) => {
    try {
        const input = req.body;
        const result = await authService.verifyEmail(input);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.verifyEmail = verifyEmail;
const resendVerification = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await authService.resendVerificationEmail(email);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.resendVerification = resendVerification;
//# sourceMappingURL=auth.controller.js.map