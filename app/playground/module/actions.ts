"use server";

import { cacheTag } from "next/cache";
import { generateEmployees } from "./data";

// eslint-disable-next-line @typescript-eslint/require-await
export async function getEmployees(total: number) {
  "use cache";
  cacheTag(`/employees?total=${total}`);
  return generateEmployees(total);
}
