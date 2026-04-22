"use client";

import useSWR, { mutate, SWRConfiguration } from "swr";
import { listSessions } from "../actions";

const key = "/auth/list-sessions";

export function useListSessions(config?: SWRConfiguration) {
  return useSWR(key, listSessions, config);
}

export const mutateListSessions = () => mutate(key);
