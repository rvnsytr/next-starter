export const activityKeys = {
  action: {
    list: "action:activities",
    getByUser: (userId: string) => `action:activities:${userId}`,
  },
} as const;
