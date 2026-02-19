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
exports.InvestmentTransaction = exports.UserInvestment = exports.InvestmentPlan = exports.InvestmentStatus = void 0;
//src/models/plan.model.ts
// src/models/plan.model.ts
const typeorm_1 = require("typeorm");
const user_model_1 = require("./user.model");
var InvestmentStatus;
(function (InvestmentStatus) {
    InvestmentStatus["ACTIVE"] = "active";
    InvestmentStatus["COMPLETED"] = "completed";
    InvestmentStatus["CANCELLED"] = "cancelled";
})(InvestmentStatus || (exports.InvestmentStatus = InvestmentStatus = {}));
let InvestmentPlan = class InvestmentPlan {
};
exports.InvestmentPlan = InvestmentPlan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], InvestmentPlan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2 }),
    __metadata("design:type", Number)
], InvestmentPlan.prototype, "minAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2 }),
    __metadata("design:type", Number)
], InvestmentPlan.prototype, "maxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], InvestmentPlan.prototype, "returnPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], InvestmentPlan.prototype, "durationHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], InvestmentPlan.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], InvestmentPlan.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], InvestmentPlan.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], InvestmentPlan.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], InvestmentPlan.prototype, "updatedAt", void 0);
exports.InvestmentPlan = InvestmentPlan = __decorate([
    (0, typeorm_1.Entity)("investment_plans")
], InvestmentPlan);
let UserInvestment = class UserInvestment {
};
exports.UserInvestment = UserInvestment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserInvestment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_model_1.User),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", user_model_1.User)
], UserInvestment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserInvestment.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => InvestmentPlan),
    (0, typeorm_1.JoinColumn)({ name: "planId" }),
    __metadata("design:type", InvestmentPlan)
], UserInvestment.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserInvestment.prototype, "planId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2 }),
    __metadata("design:type", Number)
], UserInvestment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2 }),
    __metadata("design:type", Number)
], UserInvestment.prototype, "expectedReturn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], UserInvestment.prototype, "profitEarned", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: InvestmentStatus,
        default: InvestmentStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], UserInvestment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp" }),
    __metadata("design:type", Date)
], UserInvestment.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp" }),
    __metadata("design:type", Date)
], UserInvestment.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], UserInvestment.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserInvestment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserInvestment.prototype, "updatedAt", void 0);
exports.UserInvestment = UserInvestment = __decorate([
    (0, typeorm_1.Entity)("user_investments")
], UserInvestment);
let InvestmentTransaction = class InvestmentTransaction {
};
exports.InvestmentTransaction = InvestmentTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], InvestmentTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_model_1.User),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", user_model_1.User)
], InvestmentTransaction.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], InvestmentTransaction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserInvestment),
    (0, typeorm_1.JoinColumn)({ name: "investmentId" }),
    __metadata("design:type", UserInvestment)
], InvestmentTransaction.prototype, "investment", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], InvestmentTransaction.prototype, "investmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2 }),
    __metadata("design:type", Number)
], InvestmentTransaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], InvestmentTransaction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], InvestmentTransaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], InvestmentTransaction.prototype, "balanceBefore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], InvestmentTransaction.prototype, "balanceAfter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true }),
    __metadata("design:type", Object)
], InvestmentTransaction.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], InvestmentTransaction.prototype, "createdAt", void 0);
exports.InvestmentTransaction = InvestmentTransaction = __decorate([
    (0, typeorm_1.Entity)("investment_transactions")
], InvestmentTransaction);
//# sourceMappingURL=plan.model.js.map