"use server";

import { cacheTag } from "next/cache";
import { generateSales } from "./data";

// eslint-disable-next-line @typescript-eslint/require-await
export async function getSales(total: number) {
  "use cache";
  cacheTag(`/employees?total=${total}`);
  return generateSales(total);
}
