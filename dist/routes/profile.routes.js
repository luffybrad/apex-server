"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/profile.routes.ts
const express_1 = require("express");
const profile_controller_1 = require("../controllers/profile.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Protected routes
router.get("/me", auth_middleware_1.authenticateJWT, profile_controller_1.getProfile);
router.put("/me", auth_middleware_1.authenticateJWT, profile_controller_1.updateProfile);
router.delete("/me", auth_middleware_1.authenticateJWT, profile_controller_1.deleteProfile);
exports.default = router;
//# sourceMappingURL=profile.routes.js.map