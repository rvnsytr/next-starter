export type ActivityEventType = (typeof ACTIVITY_EVENT_TYPES)[number];

export const ACTIVITY_EVENT_TYPES = [
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

export const ACTIVITY_ACTION_KEYS = {
  list: "action:activities",
  getByUser: (userId: string) => `action:activities:${userId}`,
} as const;
