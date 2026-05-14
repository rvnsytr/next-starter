"use server";

import { auth } from "@/core/auth";
import { db } from "@/core/db";
import { messages } from "@/core/messages";
import { ActionResponse } from "@/core/types";
import { activity, ActivityWithEntity } from "@/shared/db/schema";
import { Role } from "@/shared/permission";
import { desc, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { headers } from "next/headers";
import { ACTIVITY_KEYS } from "./config/keys";

async function listActivities(): Promise<ActivityWithEntity[]> {
  "use cache";
  cacheTag(ACTIVITY_KEYS["action:list"]);
  return await db.select().from(activity).orderBy(desc(activity.createdAt));
}

export async function listActivitiesAction(
  role: Role,
): Promise<ActionResponse<ActivityWithEntity[]>> {
  const hasPermission = await auth.api.userHasPermission({
    headers: await headers(),
    body: { permissions: { activity: ["list"] }, role },
  });

  if (!hasPermission.success)
    return { success: false, message: messages.forbidden };

  const data = await listActivities();
  return { success: true, data };
}

async function getUserActivities(
  userId: string,
): Promise<ActivityWithEntity[]> {
  "use cache";
  cacheTag(ACTIVITY_KEYS["action:get:user-id"](userId));
  return await db
    .select()
    .from(activity)
    .where(eq(activity.userId, userId))
    .orderBy(desc(activity.createdAt));
}

export async function getMyActivitiesAction(
  userId: string,
): Promise<ActionResponse<ActivityWithEntity[]>> {
  return { success: true, data: await getUserActivities(userId) };
}

export async function getUserActivitiesAction(
  role: Role,
  userId: string,
): Promise<ActionResponse<ActivityWithEntity[]>> {
  const hasPermission = await auth.api.userHasPermission({
    headers: await headers(),
    body: { permissions: { activity: ["get"] }, role },
  });

  if (!hasPermission.success)
    return { success: false, message: messages.forbidden };

  const data = await getUserActivities(userId);
  return { success: true, data };
}
