"use client";

import useSWR, { mutate, SWRConfiguration } from "swr";
import { listUserSessions } from "../actions";
import { authKeys } from "../config/keys";

export function useListUserSessions(userId: string, config?: SWRConfiguration) {
  const key = authKeys.actions.sessionsByUser(userId);
  const fetcher = async () => await listUserSessions(userId);
  return useSWR(key, fetcher, config);
}

export const mutateListUserSessions = (userId: string) =>
  mutate(authKeys.actions.sessionsByUser(userId));
