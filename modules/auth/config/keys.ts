export const authKeys = {
  action: {
    users: "action:users",
    sessions: "action:sessions",
    sessionsByUser: (userId: string) => `action:sessions:${userId}`,
  },
} as const;
