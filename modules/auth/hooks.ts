"use client";

import { AuthSession } from "@/modules/auth";
import useSWR, { mutate, SWRConfiguration } from "swr";
import {
  getSession,
  getSessionList,
  getUserList,
  getUserSessionList,
} from "./actions";

export function useSession(config?: SWRConfiguration) {
  return useSWR("/auth/get-session", getSession, config);
}

export function useUsers(config?: SWRConfiguration) {
  const fetcher = async () =>
    (await getUserList()).users as never[] | AuthSession["user"][];
  return useSWR("/auth/users", fetcher, config);
}

export function useSessionList(config?: SWRConfiguration) {
  const key = `/auth/list-sessions`;
  const fetcher = async () => await getSessionList();
  return useSWR(key, fetcher, config);
}

export function useUserSessionList(userId: string, config?: SWRConfiguration) {
  const key = `/auth/list-user-sessions?id=${userId}`;
  const fetcher = async () => await getUserSessionList(userId);
  return useSWR(key, fetcher, config);
}

export const mutateSession = () => mutate("/auth/get-session");
export const mutateUsers = () => mutate("/auth/users");
export const mutateSessionList = () => mutate("/auth/list-sessions");
export const mutateUserSessions = (userId: string) =>
  mutate(`/auth/list-user-sessions?id=${userId}`);
