"use server";

import { auth, Session, User } from "@/core/auth";
import { db } from "@/core/db";
import { messages } from "@/core/messages";
import { createPublicUrls, deleteFiles, uploadFiles } from "@/core/s3";
import { ActionResponse } from "@/core/types";
import { isValidUrl } from "@/core/utils";
import { activity, file as fileTable, user } from "@/shared/db/schema";
import { Role } from "@/shared/permission";
import { desc, eq, inArray } from "drizzle-orm";
import { cacheTag, revalidatePath, updateTag } from "next/cache";
import { headers as nextHeaders } from "next/headers";
import { AUTH_KEYS } from "./config/keys";

async function listUsers(): Promise<User[]> {
  "use cache";
  cacheTag(AUTH_KEYS.action.users);

  const userData = await db.select().from(user).orderBy(desc(user.createdAt));

  const userImageIds = userData
    .map((v) => v.image)
    .filter((id) => id !== null)
    .filter((id) => !isValidUrl(id));

  const fileData = await db
    .select()
    .from(fileTable)
    .where(inArray(fileTable.id, userImageIds));

  const fileMap = new Map(fileData.map((f) => [f.id, f]));

  return userData.map((user) => {
    if (!user.image) return user;
    if (isValidUrl(user.image)) return user;

    const imageFile = fileMap.get(user.image);
    if (!imageFile) return user;

    const [image] = createPublicUrls([imageFile.path]);
    return { ...user, image };
  });

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

export async function listUsersAction(
  role: Role,
): Promise<ActionResponse<User[]>> {
  const hasPermission = await auth.api.userHasPermission({
    headers: await nextHeaders(),
    body: { permissions: { user: ["list"] }, role },
  });

  if (!hasPermission.success)
    return { success: false, message: messages.forbidden };

  return { success: true, data: await listUsers() };
}

export async function updateProfileName(
  userId: string,
  body: { name: string },
) {
  const res = await auth.api.updateUser({ headers: await nextHeaders(), body });
  await db.insert(activity).values({ type: "profile-updated", userId });

  revalidatePath("/dashboard/profile");
  updateTag(AUTH_KEYS.action.users);

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
      const [{ path }] = await tx
        .delete(fileTable)
        .where(eq(fileTable.id, fileId))
        .returning({ path: fileTable.path });
      if (path) await deleteFiles([path], { visibility: "public" });
    }

    const [uploadRes] = await uploadFiles(
      [{ file, path: `avatar/${file.name}` }],
      { visibility: "public" },
    );

    const [insertRes] = await tx
      .insert(fileTable)
      .values(uploadRes.file)
      .returning();

    await tx.insert(activity).values({ type: "profile-image-updated", userId });

    return await auth.api.updateUser({
      headers,
      body: { image: insertRes.id },
    });
  });

  revalidatePath("/dashboard/profile");
  updateTag(AUTH_KEYS.action.users);

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

    if (fileId && !isValidUrl(fileId)) {
      const [{ path }] = await tx
        .delete(fileTable)
        .where(eq(fileTable.id, fileId))
        .returning({ path: fileTable.path });
      if (path) await deleteFiles([path], { visibility: "public" });
    }

    await tx.insert(activity).values({ type: "profile-image-updated", userId });
    return await auth.api.updateUser({ headers, body: { image: null } });
  });

  revalidatePath("/dashboard/profile");
  updateTag(AUTH_KEYS.action.users);

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
    const createRes = await auth.api.createUser({ headers, body });

    await tx.insert(activity).values([
      {
        type: "user-created",
        userId: createRes.user.id,
        entityId: session.user.id,
      },
      {
        type: "admin-user-create",
        userId: session.user.id,
        entityId: createRes.user.id,
      },
    ]);

    return createRes;
  });

  updateTag(AUTH_KEYS.action.users);

  return res;
}

export async function updateUserRole(body: { userId: string; role: Role }) {
  const headers = await nextHeaders();
  const session = await auth.api.getSession({ headers });
  if (!session) throw new Error(messages.unauthorized);

  const res = db.transaction(async (tx) => {
    const res = await auth.api.setRole({ headers, body });

    await tx.insert(activity).values([
      {
        type: "user-role-updated",
        userId: res.user.id,
        entityId: session.user.id,
        data: body.role,
      },
      {
        type: "admin-user-update-role",
        userId: session.user.id,
        entityId: res.user.id,
      },
    ]);

    return res;
  });

  updateTag(AUTH_KEYS.action.users);

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
      { type: "user-banned", userId: res.user.id },
      { type: "admin-user-ban", userId: session.user.id, data: res.user.name },
    ]);

    return res;
  });

  updateTag(AUTH_KEYS.action.users);

  return res;
}

export async function unbanUser(body: { userId: string }) {
  const headers = await nextHeaders();
  const session = await auth.api.getSession({ headers });
  if (!session) throw new Error(messages.unauthorized);

  const res = db.transaction(async (tx) => {
    const res = await auth.api.unbanUser({ headers, body });

    await tx.insert(activity).values([
      { type: "user-unbanned", userId: res.user.id },
      {
        type: "admin-user-unban",
        userId: session.user.id,
        data: res.user.name,
      },
    ]);

    return res;
  });

  updateTag(AUTH_KEYS.action.users);

  return res;
}

export async function impersonateUser(userId: string) {
  const headers = await nextHeaders();
  const res = await auth.api.impersonateUser({ headers, body: { userId } });
  revalidatePath("/dashboard");
  return res;
}

export async function stopImpersonateUser() {
  const headers = await nextHeaders();
  const res = await auth.api.stopImpersonating({ headers });
  revalidatePath("/dashboard/users");
  return res;
}

export async function deleteUsers(body: { userIds: string[] }) {
  const headers = await nextHeaders();
  const session = await auth.api.getSession({ headers });
  if (!session) throw new Error(messages.unauthorized);

  const res = await db.transaction(async (tx) => {
    const deleted = await tx
      .delete(user)
      .where(inArray(user.id, body.userIds))
      .returning({ name: user.name, fileId: user.image });

    const fileIds = deleted
      .map((v) => v.fileId)
      .filter((id) => !!id && !isValidUrl(id)) as string[];

    if (fileIds.length > 0) {
      const filePaths = await tx
        .delete(fileTable)
        .where(inArray(fileTable.id, fileIds))
        .returning({ path: fileTable.path });

      if (filePaths.length > 0)
        await deleteFiles(
          filePaths.map((v) => v.path),
          { visibility: "public" },
        );
    }

    console.log(deleted[0].name);

    await tx.insert(activity).values({
      type: deleted.length > 1 ? "admin-users-delete" : "admin-user-delete",
      userId: session.user.id,
      data: deleted.length > 1 ? deleted.length.toString() : deleted[0].name,
    });

    return deleted;
  });

  updateTag(AUTH_KEYS.action.users);

  return res;
}
