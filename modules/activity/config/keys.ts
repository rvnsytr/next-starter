export const ACTIVITY_KEYS = {
  action: {
    list: "action:activities",
    getByUser: (userId: string) => `action:activities:${userId}`,
  },
} as const;
