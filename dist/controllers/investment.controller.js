"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvestmentStats = exports.getAllInvestments = exports.processCompletedInvestments = exports.calculateReturns = exports.getTransactionHistory = exports.getInvestmentDetails = exports.getInvestmentHistory = exports.getActiveInvestments = exports.createInvestment = exports.getPlanById = exports.getActivePlans = exports.initializePlans = void 0;
const investment_service_1 = require("../services/investment.service");
const investmentService = new investment_service_1.InvestmentService();
// ================== INITIALIZE DEFAULT PLANS ==================
const initializePlans = async (req, res, next) => {
    try {
        await investmentService.initializeDefaultPlans();
        res.json({ message: "Default investment plans initialized successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.initializePlans = initializePlans;
// ================== GET ALL ACTIVE PLANS ==================
const getActivePlans = async (req, res, next) => {
    try {
        const plans = await investmentService.getActivePlans();
        res.json(plans);
    }
    catch (error) {
        next(error);
    }
};
exports.getActivePlans = getActivePlans;
// ================== GET PLAN BY ID ==================
const getPlanById = async (req, res, next) => {
    try {
        const { planId } = req.params;
        const plan = await investmentService.getPlanById(planId);
        res.json(plan);
    }
    catch (error) {
        next(error);
    }
};
exports.getPlanById = getPlanById;
// ================== CREATE NEW INVESTMENT ==================
const createInvestment = async (req, res, next) => {
    try {
        const input = req.body;
        const investment = await investmentService.createInvestment(req.user.id, input);
        res.status(201).json(investment);
    }
    catch (error) {
        next(error);
    }
};
exports.createInvestment = createInvestment;
// ================== GET USER'S ACTIVE INVESTMENTS ==================
const getActiveInvestments = async (req, res, next) => {
    try {
        const investments = await investmentService.getUserActiveInvestments(req.user.id);
        res.json(investments);
    }
    catch (error) {
        next(error);
    }
};
exports.getActiveInvestments = getActiveInvestments;
// ================== GET USER'S INVESTMENT HISTORY ==================
const getInvestmentHistory = async (req, res, next) => {
    try {
        const history = await investmentService.getUserInvestmentHistory(req.user.id);
        res.json(history);
    }
    catch (error) {
        next(error);
    }
};
exports.getInvestmentHistory = getInvestmentHistory;
// ================== GET INVESTMENT DETAILS ==================
const getInvestmentDetails = async (req, res, next) => {
    try {
        const { investmentId } = req.params;
        const investment = await investmentService.getInvestmentDetails(investmentId, req.user.id);
        res.json(investment);
    }
    catch (error) {
        next(error);
    }
};
exports.getInvestmentDetails = getInvestmentDetails;
// ================== GET USER'S TRANSACTION HISTORY ==================
const getTransactionHistory = async (req, res, next) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 50;
        const transactions = await investmentService.getUserTransactions(req.user.id, limit);
        res.json(transactions);
    }
    catch (error) {
        next(error);
    }
};
exports.getTransactionHistory = getTransactionHistory;
// ================== CALCULATE POTENTIAL RETURNS ==================
const calculateReturns = async (req, res, next) => {
    try {
        const { amount, planId } = req.query;
        if (!amount || !planId) {
            return res
                .status(400)
                .json({ message: "Amount and planId are required" });
        }
        const returns = await investmentService.calculatePotentialReturns(Number(amount), planId);
        res.json(returns);
    }
    catch (error) {
        next(error);
    }
};
exports.calculateReturns = calculateReturns;
// ================== ADMIN: PROCESS COMPLETED INVESTMENTS (CRON JOB ENDPOINT) ==================
const processCompletedInvestments = async (req, res, next) => {
    try {
        // This should be protected by admin middleware or a secret key
        await investmentService.processCompletedInvestments();
        res.json({ message: "Completed investments processed successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.processCompletedInvestments = processCompletedInvestments;
// ================== ADMIN: GET ALL INVESTMENTS (ADMIN ONLY) ==================
const getAllInvestments = async (req, res, next) => {
    try {
        // This would need an admin service method
        // For now, returning a placeholder
        res.json({ message: "Admin endpoint - to be implemented" });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllInvestments = getAllInvestments;
// ================== ADMIN: GET INVESTMENT STATISTICS ==================
const getInvestmentStats = async (req, res, next) => {
    try {
        // This would need an admin service method
        // For now, returning a placeholder
        res.json({ message: "Admin endpoint - to be implemented" });
    }
    catch (error) {
        next(error);
    }
};
exports.getInvestmentStats = getInvestmentStats;
//# sourceMappingURL=investment.controller.js.map