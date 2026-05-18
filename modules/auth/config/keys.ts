export const AUTH_KEYS = {
  action: {
    users: "action:users",
    sessions: "action:sessions",
    sessionsByUser: (userId: string) => `action:sessions:${userId}`,
  },
} as const;
