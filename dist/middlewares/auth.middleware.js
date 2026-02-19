"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuperAdmin = exports.isAdmin = exports.authorize = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_error_1 = require("../utils/app.error");
const user_model_1 = require("../models/user.model");
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new app_error_1.AppError("Authorization token missing", 401));
    }
    const token = authHeader.split(" ")[1];
    try {
        if (!process.env.JWT_SECRET)
            throw new app_error_1.AppError("JWT secret not defined", 500);
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (err) {
        return next(new app_error_1.AppError("Invalid or expired token", 401));
    }
};
exports.authenticateJWT = authenticateJWT;
// Role-based authorization middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new app_error_1.AppError("Not authenticated", 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new app_error_1.AppError("You don't have permission to access this resource", 403));
        }
        next();
    };
};
exports.authorize = authorize;
// Specific role middlewares
exports.isAdmin = (0, exports.authorize)(user_model_1.UserRole.ADMIN, user_model_1.UserRole.SUPER_ADMIN);
exports.isSuperAdmin = (0, exports.authorize)(user_model_1.UserRole.SUPER_ADMIN);
//# sourceMappingURL=auth.middleware.js.map