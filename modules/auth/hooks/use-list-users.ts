"use client";

import useSWR, { mutate, SWRConfiguration } from "swr";
import { listUsersAction } from "../actions";
import { Role } from "../constants/roles";
import { AUTH_QUERY_KEYS } from "../query";

export const useListUsers = (role: Role, config?: SWRConfiguration) =>
  useSWR(
    AUTH_QUERY_KEYS.users,
    async () => await listUsersAction(role),
    config,
  );

export const mutateListUsers = () => mutate(AUTH_QUERY_KEYS.users);
