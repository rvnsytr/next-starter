"use client";

import useSWR, { mutate, SWRConfiguration } from "swr";
import { listSessions } from "../actions";

export const useListSessions = (config?: SWRConfiguration) =>
  useSWR("/sessions", listSessions, config);

export const mutateListSessions = () => mutate("/sessions");
