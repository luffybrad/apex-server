"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/investment.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const auth_middleware_2 = require("../middlewares/auth.middleware");
const investmentController = __importStar(require("../controllers/investment.controller"));
const router = (0, express_1.Router)();
// ================== PUBLIC ROUTES (No Auth Required) ==================
// Investment plans - public access for viewing
router.get("/plans", investmentController.getActivePlans);
router.get("/plans/:planId", investmentController.getPlanById);
// ================== PROTECTED ROUTES (Authentication Required) ==================
router.use(auth_middleware_1.authenticateJWT); // All routes below require authentication
// Investment creation and management
router.post("/invest", investmentController.createInvestment);
router.get("/active", investmentController.getActiveInvestments);
router.get("/history", investmentController.getInvestmentHistory);
router.get("/transactions", investmentController.getTransactionHistory);
router.get("/calculate", investmentController.calculateReturns);
router.get("/:investmentId", investmentController.getInvestmentDetails);
// ================== ADMIN ROUTES (Admin Only) ==================
// Initialize default plans
router.post("/admin/init-plans", auth_middleware_2.isAdmin, investmentController.initializePlans);
// Process completed investments (can also be triggered manually by admin)
router.post("/admin/process-completed", auth_middleware_2.isAdmin, investmentController.processCompletedInvestments);
// Admin overview routes
router.get("/admin/all", auth_middleware_2.isAdmin, investmentController.getAllInvestments);
router.get("/admin/stats", auth_middleware_2.isAdmin, investmentController.getInvestmentStats);
exports.default = router;
//# sourceMappingURL=investment.routes.js.map