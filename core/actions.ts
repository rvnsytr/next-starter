"use server";

import { headers } from "next/headers";
import { allRequestMetaKey, RequestMetaKey } from "./constants/metadata";

export async function getRequestMeta() {
  const req = await headers();
  const meta = allRequestMetaKey.map((k) => [k, req.get(`x-${k}`)]);
  return Object.fromEntries(meta) as Record<RequestMetaKey, string | null>;
}
