"use server";

import { auth, Session, User } from "@/core/auth";
import { db } from "@/core/db";
import { messages } from "@/core/messages";
import { deleteFiles, uploadFiles } from "@/core/s3";
import { ActionResponse } from "@/core/types";
import { activity, file as fileTable, user } from "@/shared/db/schema";
import { Role } from "@/shared/permission";
import { desc, eq, inArray } from "drizzle-orm";
import { cacheTag, revalidatePath, updateTag } from "next/cache";
import { headers as nextHeaders } from "next/headers";

export async function updateProfileName(
  userId: string,
  body: { name: string },
) {
  const res = await auth.api.updateUser({ headers: await nextHeaders(), body });
  await db.insert(activity).values({ userId, type: "profile-updated" });
  revalidatePath("/dashboard/profile");
  return res;
}

export async function updateProfilePicture(file: File) {
  const headers = await nextHeaders();

  const session = await auth.api.getSession({ headers });
  if (!session) throw new Error(messages.unauthorized);

  const userId = session.user.id;

  const res = await db.transaction(async (tx) => {
    const [{ fileId }] = await tx
      .select({ fileId: user.image })
      .from(user)
      .where(eq(user.id, userId));

    if (fileId) {
      const [{ filePath }] = await tx
        .delete(fileTable)
        .where(eq(fileTable.id, fileId))
        .returning({ filePath: fileTable.filePath });
      if (filePath) await deleteFiles([filePath]);
    }

    const [uploadRes] = await uploadFiles([{ file, path: `avatar/${userId}` }]);
    const [insertRes] = await tx
      .insert(fileTable)
      .values(uploadRes.file)
      .returning();

    await tx.insert(activity).values({ userId, type: "profile-image-updated" });

    return await auth.api.updateUser({
      headers,
      body: { image: insertRes.id },
    });
  });

  revalidatePath("/dashboard/profile");
  return res;
}

export async function deleteProfilePicture() {
  const headers = await nextHeaders();
  const session = await auth.api.getSession({ headers });
  if (!session) throw new Error(messages.unauthorized);

  const userId = session.user.id;

  const res = await db.transaction(async (tx) => {
    const [{ fileId }] = await tx
      .select({ fileId: user.image })
      .from(user)
      .where(eq(user.id, userId));

    if (fileId) {
      const [{ filePath }] = await tx
        .delete(fileTable)
        .where(eq(fileTable.id, fileId))
        .returning({ filePath: fileTable.filePath });
      if (filePath) await deleteFiles([filePath]);
    }

    await tx.insert(activity).values({ userId, type: "profile-image-updated" });
    return await auth.api.updateUser({ headers, body: { image: null } });
  });

  revalidatePath("/dashboard/profile");
  return res;
}

export async function listSessions() {
  return await auth.api.listSessions({ headers: await nextHeaders() });
}

export async function listUserSessions(userId: string) {
  const { sessions } = await auth.api.listUserSessions({
    headers: await nextHeaders(),
    body: { userId },
  });
  return sessions as Session[];
}

export async function listUsers(role: Role): Promise<ActionResponse<User[]>> {
  const hasPermission = await auth.api.userHasPermission({
    headers: await nextHeaders(),
    body: { permissions: { user: ["list"] }, role },
  });

  if (!hasPermission.success)
    return { success: false, message: messages.forbidden };

  return { success: true, data: await cachedUsers() };
}

async function cachedUsers(): Promise<User[]> {
  "use cache";
  cacheTag("list-users");

  return await db.select().from(user).orderBy(desc(user.createdAt));

  // const countQb = db
  //   .select({
  //     total: db.$count(user),
  //     user: sql<number>`COUNT(*) FILTER (WHERE ${user.role} = 'user')`,
  //     admin: sql<number>`COUNT(*) FILTER (WHERE ${user.role} = 'admin')`,
  //     banned: sql<number>`COUNT(*) FILTER (WHERE ${user.banned} = true)`,
  //     active: sql<number>`COUNT(*) FILTER (WHERE ${user.banned} = false)`,
  //   })
  //   .from(user).$dynamic();

  // const dataQb = db.select().from(user).$dynamic();

  // const config = defineWDTConfig({
  //   columns: {
  //     name: { column: userTable.name, type: "string" },
  //     email: { column: userTable.email, type: "string" },
  //     status: {
  //       column: userTable.banned,
  //       type: "boolean",
  //       parser: (v) => typeof v === "string" && v === "banned",
  //     },
  //     role: { column: userTable.role, type: "string" },
  //     updatedAt: { column: userTable.updatedAt, type: "date" },
  //     createdAt: { column: userTable.createdAt, type: "date" },
  //   },
  //   defaultOrderBy: { id: "createdAt", desc: true },
  // });

  // const [count] = await withDataTable(countQb, state, {
  //   ...config,
  //   disabled: ["sorting", "pagination"],
  // }).execute();

  // const data = await withDataTable(dataQb, state, config).execute();

  // return { success: true, count, data: data as User[] };
}

export async function createUser(body: {
  email: string;
  password: string;
  name: string;
  role: Role;
}) {
  const headers = await nextHeaders();

  const session = await auth.api.getSession({ headers });
  if (!session) throw new Error(messages.unauthorized);

  const res = db.transaction(async (tx) => {
    const res = await auth.api.createUser({ headers, body });

    await tx.insert(activity).values([
      { userId: res.user.id, type: "user-created" },
      {
        userId: session.user.id,
        type: "admin-user-create",
        entityId: res.user.id,
      },
    ]);

    return res;
  });

  updateTag("list-users");
  return res;
}

export async function updateUserRole(body: { userId: string; role: Role }) {
  const headers = await nextHeaders();

  const session = await auth.api.getSession({ headers });
  if (!session) throw new Error(messages.unauthorized);

  const res = db.transaction(async (tx) => {
    const res = await auth.api.setRole({ headers, body });

    await tx.insert(activity).values([
      { userId: res.user.id, type: "user-role-updated", data: body.role },
      {
        userId: session.user.id,
        type: "admin-user-update-role",
        entityId: res.user.id,
      },
    ]);

    return res;
  });

  updateTag("list-users");
  return res;
}

export async function banUser(body: {
  userId: string;
  banReason?: string;
  banExpiresIn?: number;
}) {
  const headers = await nextHeaders();

  const session = await auth.api.getSession({ headers });
  if (!session) throw new Error(messages.unauthorized);

  const res = db.transaction(async (tx) => {
    const res = await auth.api.banUser({ headers, body });

    await tx.insert(activity).values([
      { userId: res.user.id, type: "user-banned" },
      {
        userId: session.user.id,
        type: "admin-user-ban",
        entityId: res.user.id,
        data: body.banReason,
      },
    ]);

    return res;
  });

  updateTag("list-users");
  return res;
}

export async function unbanUser(body: { userId: string }) {
  const headers = await nextHeaders();

  const session = await auth.api.getSession({ headers });
  if (!session) throw new Error(messages.unauthorized);

  const res = db.transaction(async (tx) => {
    const res = await auth.api.unbanUser({ headers, body });

    await tx.insert(activity).values([
      { userId: res.user.id, type: "user-unbanned" },
      {
        userId: session.user.id,
        type: "admin-user-unban",
        entityId: res.user.id,
      },
    ]);

    return res;
  });

  updateTag("list-users");
  return res;
}

export async function impersonateUser(userId: string) {
  const res = await auth.api.impersonateUser({
    headers: await nextHeaders(),
    body: { userId },
  });
  revalidatePath("/dashboard");
  return res;
}

export async function stopImpersonateUser() {
  const res = await auth.api.stopImpersonating({
    headers: await nextHeaders(),
  });
  revalidatePath("/dashboard");
  return res;
}

export async function deleteUser(body: { userId: string }) {
  const headers = await nextHeaders();

  const session = await auth.api.getSession({ headers });
  if (!session) throw new Error(messages.unauthorized);

  const res = await db.transaction(async (tx) => {
    const [{ name, fileId }] = await tx
      .select({ name: user.name, fileId: user.image })
      .from(user)
      .where(eq(user.id, body.userId));

    if (fileId) {
      const [{ filePath }] = await tx
        .delete(fileTable)
        .where(eq(fileTable.id, fileId))
        .returning({ filePath: fileTable.filePath });
      if (filePath) await deleteFiles([filePath]);
    }

    await tx.insert(activity).values({
      userId: session.user.id,
      type: "admin-user-delete",
      data: name,
    });

    return await auth.api.removeUser({ headers, body });
  });

  updateTag("list-users");
  return res;
}

export async function deleteUsers(body: { userIds: string[] }) {
  const headers = await nextHeaders();

  const session = await auth.api.getSession({ headers });
  if (!session) throw new Error(messages.unauthorized);

  const res = await db.transaction(async (tx) => {
    const fileIds = await tx
      .delete(user)
      .where(inArray(user.id, body.userIds))
      .returning({ fileId: user.image })
      .then((res) => res.map((v) => v.fileId).filter((id) => !!id) as string[]);

    if (fileIds.length > 0) {
      const filePaths = await tx
        .delete(fileTable)
        .where(inArray(fileTable.id, fileIds))
        .returning({ filePath: fileTable.filePath });

      if (filePaths.length > 0)
        await deleteFiles(filePaths.map((v) => v.filePath));
    }

    const userCount = body.userIds.length;
    await tx.insert(activity).values({
      userId: session.user.id,
      type: "admin-users-delete",
      data: userCount.toString(),
    });

    return { userCount, fileCount: fileIds.length };
  });

  updateTag("list-users");
  return res;
}
