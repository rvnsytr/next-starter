"use server";

import { auth } from "@/core/auth";
import { DataTableState } from "@/core/components/ui/data-table";
import { messages } from "@/core/constants";
import { db, withPagination } from "@/core/db";
import { user as userTable } from "@/core/schema.db";
import { removeFiles } from "@/core/storage";
import { desc } from "drizzle-orm";
import { headers as nextHeaders } from "next/headers";
import { AuthSession, Role } from "./constants";

export async function getSession() {
  return await auth.api.getSession({ headers: await nextHeaders() });
}

export async function listUsers(role: Role, state: DataTableState) {
  const hasPermission = await auth.api.userHasPermission({
    headers: await nextHeaders(),
    body: { permissions: { user: ["list"] }, role },
  });

  if (!hasPermission.success) throw new Error(messages.forbidden);

  let qb = db.select().from(userTable).$dynamic();

  if (state?.pagination) qb = withPagination(qb, state.pagination);

  const total = await db.$count(userTable);
  const data = await qb.orderBy(desc(userTable.createdAt)).execute();

  return { total, data };
}

export async function listSessions() {
  return await auth.api.listSessions({ headers: await nextHeaders() });
}

export async function listUserSessions(userId: string) {
  const { sessions } = await auth.api.listUserSessions({
    headers: await nextHeaders(),
    body: { userId },
  });

  return sessions as AuthSession["session"][];
}

export async function revokeUserSessions(ids: string[]) {
  const headers = await nextHeaders();
  return Promise.all(
    ids.map(
      async (userId) =>
        await auth.api.revokeUserSessions({ body: { userId }, headers }),
    ),
  );
}

export async function removeUsers(
  data: Pick<AuthSession["user"], "id" | "image">[],
) {
  const headers = await nextHeaders();
  return Promise.all(
    data.map(async ({ id, image }) => {
      if (image) await removeFiles([image], { isPublicUrl: true });
      return await auth.api.removeUser({ body: { userId: id }, headers });
    }),
  );
}
