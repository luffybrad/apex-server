"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const app_error_1 = require("../utils/app.error");
function errorHandler(err, req, res, next) {
    // Operational / expected errors
    if (err instanceof app_error_1.AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            errors: err.errors ?? undefined,
        });
    }
    // Unknown / programming errors
    console.error(err); // log for developers
    return res.status(500).json({
        message: "Something went wrong. Please try again later.",
    });
}
//# sourceMappingURL=error.handler.js.map