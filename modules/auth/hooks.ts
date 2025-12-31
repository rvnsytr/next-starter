"use client";

import { mutateDataTable } from "@/core/components/ui/data-table";
import useSWR, { mutate, SWRConfiguration } from "swr";
import { getSession, listSessions, listUserSessions } from "./actions";

export function useSession(config?: SWRConfiguration) {
  return useSWR("/auth/get-session", getSession, config);
}

export function useListSessions(config?: SWRConfiguration) {
  return useSWR("/auth/list-sessions", listSessions, config);
}

export function useListUserSessions(userId: string, config?: SWRConfiguration) {
  const key = `/auth/list-user-sessions?id=${userId}`;
  const fetcher = async () => await listUserSessions(userId);
  return useSWR(key, fetcher, config);
}

export const mutateSession = () => mutate("/auth/get-session");

export const mutateListSessions = () => mutate("/auth/list-sessions");

export const mutateListUserSessions = (userId: string) =>
  mutate(`/auth/list-user-sessions?id=${userId}`);

export const mutateListUsers = () => mutateDataTable("/auth/list-users");
