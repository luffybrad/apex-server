// src/config/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

// Default to DATABASE_URL, fallback to individual params
const databaseUrl = process.env.DATABASE_URL;
const isUsingConnectionString = !!databaseUrl;

export const AppDataSource = new DataSource({
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
