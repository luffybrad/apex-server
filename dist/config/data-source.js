"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
// src/config/data-source.ts
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Default to DATABASE_URL, fallback to individual params
const databaseUrl = process.env.DATABASE_URL;
const isUsingConnectionString = !!databaseUrl;
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    // Use connection string if available
    ...(isUsingConnectionString
        ? {
            url: databaseUrl,
            ssl: {
                rejectUnauthorized: false, // Required for cloud databases
            },
        }
        : {
            host: process.env.DB_HOST || "localhost",
            port: parseInt(process.env.DB_PORT || "5432"),
            username: process.env.DB_USER || "postgres",
            password: process.env.DB_PASSWORD || "",
            database: process.env.DB_NAME || "apex_jewelleries",
        }),
    // Common settings
    synchronize: process.env.NODE_ENV === "development",
    logging: process.env.NODE_ENV === "development",
    entities: ["src/models/**/*.ts"],
    migrations: ["src/migrations/**/*.ts"],
    subscribers: ["src/subscribers/**/*.ts"],
    // Connection pool
    extra: {
        max: 10,
        ...(isUsingConnectionString
            ? {
                ssl: {
                    rejectUnauthorized: false,
                },
            }
            : {}),
    },
});
//# sourceMappingURL=data-source.js.map