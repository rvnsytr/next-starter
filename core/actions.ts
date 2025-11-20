"use server";

import { headers } from "next/headers";

export async function getRequestMeta() {
  const req = await headers();
  const url = req.get("x-url");
  const origin = req.get("x-origin");
  const pathname = req.get("x-pathname");
  return { url, origin, pathname };
}
