"use client";

import useSWR, { mutate, SWRConfiguration } from "swr";
import { listUsersAction } from "../actions";
import { AUTH_QUERY_KEYS } from "../query";

export const useListUsers = (config?: SWRConfiguration) =>
  useSWR(
    AUTH_QUERY_KEYS.users,
    async () => {
      const res = await listUsersAction();
      if (!res.success) throw res;
      return res.data;
    },
    config,
  );

export const mutateListUsers = () => mutate(AUTH_QUERY_KEYS.users);
