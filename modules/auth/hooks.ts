"use client";

import useSWR, { mutate, SWRConfiguration } from "swr";
import { getSession, getSessionList, getUserList } from "./actions";

export function useSession(config?: SWRConfiguration) {
  return useSWR("session", getSession, config);
}

export function useSessionList(config?: SWRConfiguration) {
  return useSWR("sessionList", getSessionList, config);
}

export function useUsers(config?: SWRConfiguration) {
  const fetcher = async () => (await getUserList()).users;
  return useSWR("users", fetcher, config);
}

export const mutateSession = () => mutate("session");
export const mutateSessionList = () => mutate("sessionList");
export const mutateUsers = () => mutate("users");
