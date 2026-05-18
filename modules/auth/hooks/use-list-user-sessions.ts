"use client";

import useSWR, { mutate, SWRConfiguration } from "swr";
import { listUserSessions } from "../actions";
import { AUTH_KEYS } from "../config/keys";

export function useListUserSessions(userId: string, config?: SWRConfiguration) {
  const key = AUTH_KEYS.action.sessionsByUser(userId);
  const fetcher = async () => await listUserSessions(userId);
  return useSWR(key, fetcher, config);
}

export const mutateListUserSessions = (userId: string) =>
  mutate(AUTH_KEYS.action.sessionsByUser(userId));
