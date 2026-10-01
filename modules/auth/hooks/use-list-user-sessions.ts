"use client";

import useSWR, { mutate, SWRConfiguration } from "swr";
import { listUserSessions } from "../actions";

export const useListUserSessions = (
  userId: string,
  config?: SWRConfiguration,
) =>
  useSWR(
    `/sessions/${userId}`,
    async () => await listUserSessions(userId),
    config,
  );

export const mutateListUserSessions = (userId: string) =>
  mutate(`/sessions/${userId}`);
