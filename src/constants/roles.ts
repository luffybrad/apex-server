// src/constants/roles.ts
export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

// Array of role values for validation
export const ROLE_VALUES = [ROLES.USER, ROLES.ADMIN, ROLES.SUPER_ADMIN];

// Type for TypeScript
export type UserRole = (typeof ROLES)[keyof typeof ROLES];
