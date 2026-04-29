"use client";

import useSWR, { mutate, SWRConfiguration } from "swr";
import { listUserSessions } from "../actions";

export function useListUserSessions(userId: string, config?: SWRConfiguration) {
  const key = `/auth/list-user-sessions?id=${userId}`;
  const fetcher = async () => await listUserSessions(userId);
  return useSWR(key, fetcher, config);
}

export const mutateListUserSessions = (userId: string) =>
  mutate(`/auth/list-user-sessions?id=${userId}`);
