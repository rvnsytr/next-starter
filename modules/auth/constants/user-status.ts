export type UserStatus = (typeof USER_STATUSES)[number];

export const USER_STATUSES = [
  "verified",
  "active",
  "nonactive",
  "banned",
] as const;
