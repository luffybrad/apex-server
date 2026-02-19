"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_error_1 = require("./app.error");
function generateToken(payload) {
    if (!process.env.JWT_SECRET)
        throw new app_error_1.AppError("JWT secret not defined", 500);
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
}
//# sourceMappingURL=jwt.js.map