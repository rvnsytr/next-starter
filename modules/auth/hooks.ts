"use client";

import { AuthSession } from "@/core/auth";
import useSWR, { mutate, SWRConfiguration } from "swr";
import { getSession, getSessionList, getUserList } from "./actions";

export function useSession(config?: SWRConfiguration) {
  return useSWR("/auth/get-session", getSession, config);
}

export function useSessionList(config?: SWRConfiguration) {
  return useSWR("/auth/list-sessions", getSessionList, config);
}

export function useUsers(config?: SWRConfiguration) {
  const fetcher = async () =>
    (await getUserList()).users as never[] | AuthSession["user"][];
  return useSWR("/auth/users", fetcher, config);
}

export const mutateSession = () => mutate("/auth/get-session");
export const mutateSessionList = () => mutate("/auth/list-sessions");
export const mutateUsers = () => mutate("/auth/users");
