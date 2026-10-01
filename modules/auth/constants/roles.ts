export type Role = (typeof ROLES)[number];

export const ROLES = ["user", "admin"] as const;

export const DEFAULT_ROLE: Role = "user";
