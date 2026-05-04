export type ActivityType = (typeof allActivityType)[number];
export const allActivityType = [
  // "user-registered",
  "user-created",
  // "user-imported",
  // "user-activated",
  // "user-verified",
  "user-role-updated",
  "user-banned",
  "user-unbanned",
  // "user-deleted",

  "profile-updated",
  "profile-image-updated",

  // "password-reset",
  // "password-changed",

  "admin-user-create",
  // "admin-user-import",
  "admin-user-update-role",
  "admin-user-ban",
  "admin-user-unban",
  "admin-user-delete",
  "admin-users-delete",
] as const;
