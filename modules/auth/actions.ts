"use server";

import { auth, AuthSession } from "@/core/auth";
import { removeFiles } from "@/core/storage";
import { headers } from "next/headers";

export async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function getSessionList() {
  return await auth.api.listSessions({ headers: await headers() });
}

export async function getUserList() {
  return await auth.api.listUsers({
    headers: await headers(),
    query: { sortBy: "createdAt", sortDirection: "desc" },
  });
}

export async function revokeUserSessions(ids: string[]) {
  return Promise.all(
    ids.map(
      async (id) =>
        await auth.api.revokeUserSessions({
          body: { userId: id },
          headers: await headers(),
        }),
    ),
  );
}

export async function deleteUsers(
  data: Pick<AuthSession["user"], "id" | "image">[],
) {
  return Promise.all(
    data.map(async ({ id, image }) => {
      if (image) await removeFiles([image], { isPublicUrl: true });
      return await auth.api.removeUser({
        body: { userId: id },
        headers: await headers(),
      });
    }),
  );
}
