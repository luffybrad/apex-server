"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDTO = validateDTO;
const class_validator_1 = require("class-validator");
const app_error_1 = require("./app.error");
async function validateDTO(dto) {
    const errors = await (0, class_validator_1.validate)(dto);
    if (errors.length) {
        const formatted = {};
        errors.forEach(err => {
            if (err.constraints)
                formatted[err.property] = Object.values(err.constraints);
        });
        throw new app_error_1.AppError("Validation failed", 400, formatted);
    }
}
//# sourceMappingURL=validation.js.map