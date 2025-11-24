import useSWR, { SWRConfiguration } from "swr";
import { getSession } from "./actions";

export function useSession(config?: SWRConfiguration) {
  return useSWR("/auth/session", getSession, config);
}
