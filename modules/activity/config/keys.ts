export const activityKeys = {
  actions: {
    list: "action:activities",
    getByUser: (userId: string) => `action:activities:${userId}`,
  },
} as const;
