// TODO: component level cache
export const AUTH_KEYS = {
  "action:users": "/auth/admin/list-users",
  "action:sessions": "/auth/list-sessions",
  "action:sessions:user-id": (userId: string) =>
    `/auth/list-user-sessions?id=${userId}`,
};
