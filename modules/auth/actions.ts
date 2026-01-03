"use server";

import { auth } from "@/core/auth";
import { DataTableState } from "@/core/components/ui/data-table";
import { ActionResponse, messages } from "@/core/constants";
import { db, withDataTable, WithDataTableConfig } from "@/core/db";
import { user as userTable } from "@/core/schema.db";
import { removeFiles } from "@/core/storage";
import { sql } from "drizzle-orm";
import { headers as nextHeaders } from "next/headers";
import { AuthSession, Role, UserStatus } from "./constants";

export async function getSession() {
  return await auth.api.getSession({ headers: await nextHeaders() });
}

export async function listUsers(
  role: Role,
  state: DataTableState,
): Promise<ActionResponse<AuthSession["user"][], "user" | Role | UserStatus>> {
  const hasPermission = await auth.api.userHasPermission({
    headers: await nextHeaders(),
    body: { permissions: { user: ["list"] }, role },
  });

  if (!hasPermission.success)
    return { success: false, error: messages.forbidden };

  const countQb = db
    .select({
      total: db.$count(userTable),
      user: sql<number>`count(*) filter (where ${userTable.role} = 'user')`,
      admin: sql<number>`count(*) filter (where ${userTable.role} = 'admin')`,
      banned: sql<number>`count(*) filter (where ${userTable.banned} = true)`,
      active: sql<number>`count(*) filter (where ${userTable.banned} = false)`,
    })
    .from(userTable)
    .$dynamic();
  const dataQb = db.select().from(userTable).$dynamic();

  const config: WithDataTableConfig = {
    globalFilter: { columns: [userTable.name, userTable.email] },
    sorting: {
      default: { column: userTable.createdAt, desc: true },
      columns: [
        { id: "name", column: userTable.name },
        { id: "email", column: userTable.email },
        { id: "status", column: userTable.banned },
        { id: "role", column: userTable.role },
        { id: "updatedAt", column: userTable.updatedAt },
        { id: "createdAt", column: userTable.createdAt },
      ],
    },
  };

  const [count] = await withDataTable(countQb, state, {
    disabled: ["pagination", "sorting"],
    ...config,
  }).execute();
  const data = await withDataTable(dataQb, state, config).execute();

  return { success: true, count, data: data as AuthSession["user"][] };
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
