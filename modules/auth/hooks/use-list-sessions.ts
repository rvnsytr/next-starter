"use client";

import useSWR, { mutate, SWRConfiguration } from "swr";
import { listSessions } from "../actions";
import { authKeys } from "../config/keys";

export function useListSessions(config?: SWRConfiguration) {
  return useSWR(authKeys.action.sessions, listSessions, config);
}

export const mutateListSessions = () => mutate(authKeys.action.sessions);
