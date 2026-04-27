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

async function cachedActivities(): Promise<ActivityWithEntity[]> {
  "use cache";
  cacheTag("activities");
  return await db.select().from(activity).orderBy(desc(activity.createdAt));
}

export async function listActivities(
  role: Role,
): Promise<ActionResponse<ActivityWithEntity[]>> {
  const hasPermission = await auth.api.userHasPermission({
    headers: await headers(),
    body: { permissions: { activity: ["list"] }, role },
  });

  if (!hasPermission.success)
    return { success: false, message: messages.forbidden };

  const data = await cachedActivities();
  return { success: true, data };
}

async function cachedActivity(userId: string): Promise<ActivityWithEntity[]> {
  "use cache";
  cacheTag(`activity-${userId}`);
  return await db
    .select()
    .from(activity)
    .where(eq(activity.userId, userId))
    .orderBy(desc(activity.createdAt));
}

export async function getMyActivities(
  userId: string,
): Promise<ActionResponse<ActivityWithEntity[]>> {
  return { success: true, data: await cachedActivity(userId) };
}

export async function getActivities(
  role: Role,
  userId: string,
): Promise<ActionResponse<ActivityWithEntity[]>> {
  const hasPermission = await auth.api.userHasPermission({
    headers: await headers(),
    body: { permissions: { activity: ["get"] }, role },
  });

  if (!hasPermission.success)
    return { success: false, message: messages.forbidden };

  const data = await cachedActivity(userId);
  return { success: true, data };
}
