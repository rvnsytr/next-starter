"use client";

import useSWR, { mutate, SWRConfiguration } from "swr";
import { listSessions } from "../actions";
import { AUTH_KEYS } from "../config/keys";

export function useListSessions(config?: SWRConfiguration) {
  return useSWR(AUTH_KEYS.action.sessions, listSessions, config);
}

export const mutateListSessions = () => mutate(AUTH_KEYS.action.sessions);
